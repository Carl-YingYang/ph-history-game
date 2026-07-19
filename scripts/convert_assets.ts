/**
 * convert_assets.ts — Phase 3 asset pipeline.
 *
 * Reads the cloned Phaser source repo's atlas JSON + PNG pairs and emits:
 *   - godot-project/assets/characters/<name>.png   (copied)
 *   - godot-project/assets/tilesets/<name>.png     (copied, environment)
 *   - godot-project/assets/characters/<name>.png.import (nearest/no-mipmap)
 *   - godot-project/resources/sprite_frames/<name>.tres  (SpriteFrames w/ AtlasTexture)
 *
 * The Phaser atlas JSON is "JSON Hash": { frames: { "<char>_<anim>_<i>":
 * { frame: {x,y,w,h} } }, meta: { image, size } }. We group frames by the
 * middle token (idle/walk/run/jump/attack/hurt/dead/fall/climb/jumpattack)
 * and emit one SpriteFrames animation per group, plus a "portrait" anim for
 * the <char>_portrait frame.
 *
 * Run:  bun run scripts/convert_assets.ts
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const SRC = '/tmp/ph-history-game/src/app/assets';
const GODOT = '/home/z/my-project/godot-project';
const CHAR_DIR = join(GODOT, 'assets/characters');
const TILE_DIR = join(GODOT, 'assets/tilesets');
const SF_DIR = join(GODOT, 'resources/sprite_frames');

for (const d of [CHAR_DIR, TILE_DIR, SF_DIR]) mkdirSync(d, { recursive: true });

const CHARACTER_SHEETS = [
  'rizal','ibara','clara','damaso','simoun','salve','elias','sisa','basilio','tiago',
  'student-npc','villager-npc','religious-npc','spanish-npc','misc-npc','animals-assets',
];
const ENVIRONMENT_SHEETS = [
  'building-assets','nature-assets','interior-assets','furniture-assets',
  'collectible-assets','icons-assets','ui-assets','gamedev-assets',
];

const ANIM_DEFAULTS: Record<string, { frameRate: number; loop: boolean }> = {
  idle:       { frameRate: 8,  loop: true  },
  walk:       { frameRate: 10, loop: true  },
  run:        { frameRate: 13, loop: true  },
  jump:       { frameRate: 8,  loop: false },
  attack:     { frameRate: 14, loop: false },
  hurt:       { frameRate: 10, loop: false },
  dead:       { frameRate: 8,  loop: false },
  fall:       { frameRate: 10, loop: false },
  climb:      { frameRate: 8,  loop: true  },
  jumpattack: { frameRate: 14, loop: false },
  portrait:   { frameRate: 1,  loop: false },
};

interface AtlasFrame { frame: { x: number; y: number; w: number; h: number }; }
interface AtlasJSON { frames: Record<string, AtlasFrame>; }

function escId(s: string): string {
  return s.replace(/[^a-zA-Z0-9_]/g, '_');
}

function writePngImport(pngPath: string): void {
  const importPath = pngPath + '.import';
  const content = `[remap]

importer="texture"
type="CompressedTexture2D"

[deps]

source_file="${pngPath.replace(/\\/g, '/')}"
dest_files=["${pngPath.replace(/\\/g, '/')}.godot"]

[params]
mipmaps/generate=false
mipmaps/limit=-1
roughness/mode=0
roughness/src_normal=""
process/fix_alpha_border=true
process/premult_alpha=false
process/normal_map_invert_y=false
process/hdr_as_srgb=false
process/hdr_clamp_exposure=false
process/size_limit=0
detect_3d/compress_to=1
`;
  writeFileSync(importPath, content);
}

function generateSpriteFrames(name: string, isCharacter: boolean): void {
  const jsonPath = join(SRC, `${name}.json`);
  if (!existsSync(jsonPath)) { console.warn(`  ! missing atlas JSON: ${name}`); return; }
  const atlas: AtlasJSON = JSON.parse(readFileSync(jsonPath, 'utf8'));

  const groups: Record<string, { index: number; frame: AtlasFrame }[]> = {};
  for (const frameName of Object.keys(atlas.frames)) {
    const parts = frameName.split('_');
    let anim: string;
    if (parts.length >= 2 && parts[parts.length - 1] === 'portrait') {
      anim = 'portrait';
    } else if (parts.length >= 3) {
      anim = parts[parts.length - 2];
      const idx = parseInt(parts[parts.length - 1], 10);
      if (isNaN(idx)) anim = parts[parts.length - 1];
    } else {
      anim = parts[parts.length - 1];
    }
    if (!groups[anim]) groups[anim] = [];
    const idxMatch = parts[parts.length - 1].match(/^(\d+)$/);
    const index = idxMatch ? parseInt(idxMatch[1], 10) : 0;
    groups[anim].push({ index, frame: atlas.frames[frameName] });
  }
  for (const anim of Object.keys(groups)) groups[anim].sort((a, b) => a.index - b.index);

  const pngRel = isCharacter
    ? `res://assets/characters/${name}.png`
    : `res://assets/tilesets/${name}.png`;

  const subBlocks: string[] = [];
  const subIds: string[] = [];

  const animOrder = isCharacter
    ? ['idle','walk','run','attack','hurt','dead','jump','fall','climb','jumpattack','portrait']
    : ['default'];

  if (!isCharacter) {
    const allFrames: AtlasFrame[] = [];
    for (const fn of Object.keys(atlas.frames)) allFrames.push(atlas.frames[fn]);
    groups['default'] = allFrames.map((f, i) => ({ index: i, frame: f }));
  }

  const animEntries: string[] = [];
  for (const anim of animOrder) {
    if (!groups[anim] || groups[anim].length === 0) continue;
    const cfg = ANIM_DEFAULTS[anim] ?? { frameRate: 10, loop: false };
    const framesText: string[] = [];
    for (let i = 0; i < groups[anim].length; i++) {
      const f = groups[anim][i].frame;
      const subId = `atlas_${escId(anim)}_${i}`;
      subIds.push(subId);
      const region = `Rect2(${f.frame.x}, ${f.frame.y}, ${f.frame.w}, ${f.frame.h})`;
      subBlocks.push(`[sub_resource type="AtlasTexture" id="${subId}"]
atlas = ExtResource("1")
region = ${region}
`);
      framesText.push(`{
"duration": 1.0,
"texture": SubResource("${subId}")
}`);
    }
    animEntries.push(`{
"frames": [${framesText.join(', ')}],
"loop": ${cfg.loop},
"name": &"${anim}",
"speed": ${cfg.frameRate}.0
}`);
  }

  const loadSteps = subIds.length + 2;
  let tres = `[gd_resource type="SpriteFrames" load_steps=${loadSteps} format=3]

[ext_resource type="Texture2D" path="${pngRel}" id="1"]

`;
  tres += subBlocks.join('');
  tres += `
[resource]
animations = [${animEntries.join(', ')}]
`;
  writeFileSync(join(SF_DIR, `${name}.tres`), tres);
}

function main() {
  console.log('PROJECT NOOR — asset conversion (Phaser atlas -> Godot SpriteFrames)');
  for (const name of CHARACTER_SHEETS) {
    const srcPng = join(SRC, `${name}.png`);
    const dstPng = join(CHAR_DIR, `${name}.png`);
    if (existsSync(srcPng)) { copyFileSync(srcPng, dstPng); writePngImport(dstPng); }
    generateSpriteFrames(name, true);
    console.log(`  + character: ${name}`);
  }
  for (const name of ENVIRONMENT_SHEETS) {
    const srcPng = join(SRC, `${name}.png`);
    const dstPng = join(TILE_DIR, `${name}.png`);
    if (existsSync(srcPng)) { copyFileSync(srcPng, dstPng); writePngImport(dstPng); }
    generateSpriteFrames(name, false);
    console.log(`  + environment: ${name}`);
  }
  console.log('Done. SpriteFrames .tres written to godot-project/resources/sprite_frames/');
}
main();
