//Credits: https://github.com/rreusser/glsl-solid-wireframe/blob/master/cartesian/scaled.glsl
precision mediump float;
    varying vec3 p;
    uniform float cartesianX, cartesianY, cartesianZ;
    uniform float width, acceleration, sharpness, opacityA, opacityB;
    uniform vec3 hue;
    uniform float time;

    float gridFactor (vec3 parameter, float width_0, float sharpness_0, float a) {
        float s = max(sharpness_0 - (cos(time) * a), sharpness_0);
        float w1 = max(width_0 * a, width_0);
        vec3 d = fwidth(parameter);
        d.x = (cos(time) * 0.3 * d.x + d.x);
        d.y = (cos(time) * 0.3 * d.y + d.y);
        d.z = (cos(time) * 0.3 * d.z + d.z);
        vec3 looped = 0.5 - sin(abs(mod(parameter, 1.0) * 1.0) - 0.5);
        looped.x = sin(time) * 0.5 * looped.x + looped.x;
        looped.y = sin(time) * 0.6 * looped.y + looped.y;
        looped.z = sin(time) * 0.5 * looped.z + looped.z;
        vec3 a3 = smoothstep(d * w1, d * (w1 + s), looped);
        return min(min(a3.x, a3.y), a3.z) ;
    } 

      void main () {
            float g = gridFactor( vec3( cartesianX > 0.0 ? p.x * cartesianX : 0.5, cartesianY > 0.0 ? p.y * cartesianY : 0.5, cartesianZ > 0.0 ? p.z * cartesianZ : 0.5 ), width, sharpness, acceleration);
            vec4 color = vec4(hue.x / 255.0, hue.y /255.0, hue.z /255.0, opacityA);
            vec4 mixed = mix(color, vec4(color.xyz /2.0, opacityB), g);
            gl_FragColor =  mixed;
      }
