// hit_flash.gdshader — pulses the sprite white when the host takes damage.
// Driven by the `flash_amount` uniform (0 = normal, 1 = full white).
shader_type canvas_item;

uniform float flash_amount : hint_range(0.0, 1.0) = 0.0;
uniform vec4 flash_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);

void fragment() {
	vec4 base = texture(TEXTURE, UV);
	vec3 out_col = mix(base.rgb, flash_color.rgb, flash_amount);
	COLOR = vec4(out_col, base.a);
}
