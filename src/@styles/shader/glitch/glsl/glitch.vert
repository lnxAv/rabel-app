precision mediump float;
varying vec2 v_coord;
varying vec3 v_normal;
varying vec3 v_pos;
varying vec3 u_eye;
varying mat4 u_mvp;
varying mat4 u_model;
uniform float u_time;
uniform vec3 u_light_dir;
uniform vec4 u_light_color;

void main() {
      v_coord = uv;
      v_normal = normal;
      u_eye = cameraPosition;
      u_mvp = modelViewMatrix;
      u_model = modelMatrix;
      vec3 pos = position;
      vec4 pos4 = (u_model * vec4(pos,1.0));
      float depth = pos4.z / pos4.w;
      v_pos = (u_model * vec4(pos,1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
 