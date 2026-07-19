#!/bin/bash
# Sequential asset generation (avoid 429 rate limits)
set +e
OUT_BG="/home/z/my-project/public/story/backgrounds"
OUT_CH="/home/z/my-project/public/story/characters"
SIZE_BG="1344x768"
SIZE_CH="768x1344"

gen() {
  local prompt="$1"; local out="$2"; local size="$3"
  if [ -f "$out" ] && [ -s "$out" ]; then echo "SKIP: $(basename $out)"; return; fi
  echo "GEN: $(basename $out)"
  # retry up to 3 times on rate limit
  for attempt in 1 2 3; do
    z-ai image -p "$prompt" -o "$out" -s "$size" 2>&1 | tail -1
    if [ -f "$out" ] && [ -s "$out" ]; then echo "OK: $(basename $out) ($(du -h $out | cut -f1))"; return; fi
    echo "  retry $attempt in 8s..."
    sleep 8
  done
  echo "FAIL: $(basename $out)"
}

# Backgrounds
gen "Cinematic painterly illustration, 1880s Manila Bay at golden sunset, a Spanish colonial steamship arriving at port, warm orange sky reflected on calm water, distant walled city of Intramuros silhouette, soft atmospheric haze, visual novel background art, no people, highly detailed, golden hour lighting" "$OUT_BG/manila-bay.png" $SIZE_BG
gen "Cinematic painterly illustration, 1880s Binondo street in Manila at dusk, colonial Spanish architecture, wooden shop houses with capiz shell windows, hanging paper lanterns glowing warm, cobblestone street, atmospheric fog, lamplight, visual novel background art, no people, moody cinematic lighting, highly detailed" "$OUT_BG/binondo-street.png" $SIZE_BG
gen "Cinematic painterly illustration, opulent 1880s Filipino colonial dining room, long mahogany table with candles and silver, capiz shell windows, crystal chandeliers, warm amber glow, elaborate period furniture, visual novel background art, no people, warm cinematic interior lighting, highly detailed" "$OUT_BG/dining-room.png" $SIZE_BG
gen "Cinematic painterly illustration, rustic 1880s Philippine schoolhouse interior, wooden desks, chalkboard, morning sunlight streaming through slatted windows, dust motes in light beams, simple colonial architecture, hopeful peaceful mood, visual novel background art, no people, soft warm lighting, highly detailed" "$OUT_BG/schoolhouse.png" $SIZE_BG
gen "Cinematic painterly illustration, 1880s San Diego town plaza in rural Philippines, white stone church with bell tower, colonial plaza, palm trees, quiet morning mist, tropical sky, visual novel background art, no people, serene atmospheric lighting, highly detailed" "$OUT_BG/town-plaza.png" $SIZE_BG
gen "Cinematic painterly illustration, interior of a grand 1880s Philippine Spanish colonial church, stone pillars, stained glass windows casting colored light, wooden pews, altar with candles, reverent solemn atmosphere, god rays, visual novel background art, no people, dramatic cinematic lighting, highly detailed" "$OUT_BG/church.png" $SIZE_BG
gen "Cinematic painterly illustration, dense tropical Philippine forest at dawn, mist between trees, ferns and vines, golden light filtering through canopy, mysterious atmosphere, visual novel background art, no people, atmospheric cinematic lighting, highly detailed" "$OUT_BG/forest.png" $SIZE_BG
gen "Cinematic painterly illustration, dark 1880s Philippine prison cell, stone walls, single small barred window with moonlight, wooden bench, dim oil lamp, somber oppressive mood, visual novel background art, no people, dramatic chiaroscuro lighting, highly detailed" "$OUT_BG/prison.png" $SIZE_BG
gen "Cinematic painterly illustration, Pasig river at night under moonlight, wooden bancas on calm water, nipa palm huts along bank, fireflies, starry sky reflected in water, serene mystical mood, visual novel background art, no people, cool blue cinematic lighting, highly detailed" "$OUT_BG/river-night.png" $SIZE_BG
gen "Cinematic painterly illustration, cozy 1880s study library, walls of old leather books, warm oil lamp on wooden desk, papers and quill, globe, scholarly warm atmosphere, visual novel background art, no people, warm amber cinematic lighting, highly detailed" "$OUT_BG/library.png" $SIZE_BG
echo "=== BACKGROUNDS DONE ==="

# Characters
gen "Visual novel character portrait, half-body, Crisostomo Ibarra, handsome young Filipino man in his mid-20s, 1880s European-educated gentleman attire, dark tailored coat and cravat, thoughtful intelligent expression, short black hair, warm olive skin, painterly anime-influenced style, neutral dark background, soft cinematic lighting, highly detailed" "$OUT_CH/ibarra.png" $SIZE_CH
gen "Visual novel character portrait, half-body, Maria Clara, beautiful young Filipina woman, traditional 1880s mestiza dress with panuelo, long flowing black hair, serene gentle expression, delicate features, painterly anime-influenced style, soft warm neutral background, cinematic soft lighting, highly detailed" "$OUT_CH/maria-clara.png" $SIZE_CH
gen "Visual novel character portrait, half-body, Fray Damaso, stern older Spanish Franciscan friar, heavyset, brown habit robe, bald with tonsure, bushy gray beard, arrogant harsh expression, painterly anime-influenced style, dark neutral background, dramatic cinematic lighting, highly detailed" "$OUT_CH/damaso.png" $SIZE_CH
gen "Visual novel character portrait, half-body, Capitan Tiago, wealthy middle-aged Filipino businessman in 1880s, fine European suit with boutonniere, neatly groomed mustache, genial host expression, painterly anime-influenced style, warm neutral background, soft cinematic lighting, highly detailed" "$OUT_CH/tiago.png" $SIZE_CH
gen "Visual novel character portrait, half-body, Elias, rugged mysterious Filipino boatman in his 30s, weathered tan skin, simple white camisa de chino, straw hat pushed back, intense dark eyes, scar on cheek, painterly anime-influenced style, misty dark background, dramatic cinematic lighting, highly detailed" "$OUT_CH/elias.png" $SIZE_CH
gen "Visual novel character portrait, half-body, Sisa, tragic Filipina mother in 1880s, long disheveled black hair, simple worn dress, sorrowful haunted expression, tears on cheeks, painterly anime-influenced style, dark misty background, dramatic melancholic cinematic lighting, highly detailed" "$OUT_CH/sisa.png" $SIZE_CH
echo "=== CHARACTERS DONE ==="
echo "=== ALL ASSETS GENERATED ==="
ls -la $OUT_BG $OUT_CH
