precision mediump float;

varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_pos;
uniform float u_time;
uniform vec3 u_eye;
uniform vec4 u_color;
uniform vec3 u_light_dir;
uniform vec4 u_light_color;
uniform vec3 u_hue_color;
uniform float u_alpha_threshold;
uniform sampler2D u_glitchalpha_texture;

mat3 computeTBN(){
      vec3 dp1 = dFdx( v_pos );
      vec3 dp2 = dFdy( v_pos );
      vec2 duv1 = dFdx( v_coord );
      vec2 duv2 = dFdy( v_coord );
      vec3 dp2perp = cross( dp2, v_normal );
      vec3 dp1perp = cross( v_normal, dp1 );
      vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
      vec3 binormal = dp2perp * duv1.y + dp1perp * duv2.y;
      float invmax = inversesqrt( max( dot(tangent,tangent), dot(binormal,binormal) ) );
      return mat3( tangent * invmax, binormal * invmax, v_normal );
}

void main() {
      vec3 normal = normalize(v_normal);
      //float depth = (gl_FragCoord.z / gl_FragCoord.w);
      vec3 view_dir = normalize(v_pos - u_eye);
      vec3 light_dir = normalize(u_light_dir);
      vec3 half_dir = normalize(view_dir + light_dir);
      mat3 TBN = computeTBN();
      float float_83 = 0.500;
      float float_122 = 0.300;
      vec4 vec4_31 = u_color;
      float sin_78 = sin(u_time);
      float cos_114 = cos(u_time);
      float float_A124 = 0.600;
      float mul_124 = float_A124 * u_time;
      float sin_147 = sin(u_time);
      vec3 normalize_153 = normalize(view_dir);
      vec3 normalize_157 = normalize(view_dir);
      float mul_119 = float_122 * u_time;
      float fract_80 = fract(sin_78);
      float fract_115 = fract(cos_114);
      float fract_146 = fract(sin_147);
      float mul_152 = v_pos.x * v_pos.z;
      vec3 mul_156 = normalize_153 ;
      vec3 mul_158 = normalize_157 ;
      float if_113;
      if(float_83 > fract_80)
      {
      } else if (float_83 < fract_80){
         if_113 = fract_80;
      } else {
      }
      float if_116;
      if(float_83 > fract_115)
      {
         if_116 = fract_115;
      } else if (float_83 < fract_115){
      } else {
      }
      float float_1270 = 0.0;
      float float_1271 = -0.40;
      float smoothstep_127 = smoothstep(float_1270,float_1271,mul_152);
      vec2 vec2_66 = mul_156.xy;
      vec2 vec2_54 = mul_158.xy;
      float float_A121 = 0.600;
      float mul_121 = float_A121 * if_116;
      float sub_149 = smoothstep_127 - fract_146;
      vec2 panner_70 = vec2_66;
      panner_70.x += 1.000 * mul_124;
      panner_70.y += 1.000 * mul_124;
      vec2 panner_65 = vec2_54;
      panner_65.x += 0.000 * mul_119;
      panner_65.y += -1.000 * mul_119;
      float float_B151 = 0.6;
      float div_151 = sub_149 / float_B151;
      vec2 add_84 = panner_70 + mul_121;
      vec2 add_85 = panner_65 + if_113;
      vec4 color_63 = texture2D(u_glitchalpha_texture, add_84);
      vec4 color_6 = texture2D(u_glitchalpha_texture, add_85);
      float add_76 = color_63.r + color_6.r;
      float float_74 = float(add_76);
      float add_132 = float_74 + div_151;
      vec4 add_100 = vec4_31 + add_132;
      float specular_intensity = 1.0;
      float gloss = 1.0;
      vec3 diffuse_color = add_100.xyz;
      float lambertian = max(dot(light_dir,normal), 0.0);
      vec3 diffuse_light = lambertian * vec3(1.0);
      float ambient_intensity = 0.2;
      vec3 ambient_light =  vec3(1.0) * ambient_intensity;
      vec3 reflect_dir = reflect(light_dir, normal);
      float spec_angle = max(dot(reflect_dir, view_dir), 0.0);
      float specular_light = pow(spec_angle, gloss) * specular_intensity;
      vec3 specular_color = u_light_color.xyz * specular_light;
      vec3 refraction_color = vec3(0.0);
      vec3 emission = vec3(0.0);
      gl_FragColor = vec4( (emission + refraction_color + specular_color + (ambient_light + diffuse_light) *( diffuse_color - u_color.xyz) / mul_124) + u_hue_color , 1.0 );
}