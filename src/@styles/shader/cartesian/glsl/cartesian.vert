// vertex shader
precision mediump float;
varying vec3 p;

void main () {
    p = position;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}