import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import React, { memo, useRef } from 'react';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { BackSide, Vector3, Vector4 } from 'three';
import dynamic from 'next/dynamic';
import fake_uv from '../../../../public/three/glitchalpha.png';
import vertex from './glsl/glitch.vert';
import fragment from './glsl/glitch.frag';
import { RhombicDodecaedron } from '../../../@components/x/x-shapes/rhombic_dodecahedron';

const GlitchMaterial = shaderMaterial(
  {
    u_glitchalpha_texture: null,
    u_time: 0,
    u_opacity: 0.9,
    u_color: new Vector4(0, 1, 0, 1),
    u_hue_color: new Vector3(0.5, 0, 0),
    u_light_dir: new Vector3(0, -5, 0),
    u_light_color: new Vector4(0, 0, 0, 0),
  },
  vertex,
  fragment
);

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
// @ts-ignore
GlitchMaterial.key = THREE.MathUtils.generateUUID();

extend({ GlitchMaterial });

const GlitchShader = memo(
  ({ children, ...props }: any) => {
    const meshRef = useRef(null);
    const glitchTexture = useTexture(fake_uv.src);
    useFrame((time) => {
      if (meshRef?.current) {
        // @ts-ignore
        meshRef.current.material.uniforms.u_time.value = Math.sin(time.clock.elapsedTime / 1.5) * 5;
      }
    });

    return (
      <RhombicDodecaedron ref={meshRef} detail={0} position={[0, 0, 0]} {...props}>
        {/* @ts-ignore */}
        <glitchMaterial
          key={GlitchMaterial.key}
          blending={THREE.AdditiveBlending}
          side={BackSide}
          renderOrder={1}
          uniforms={{
            u_glitchalpha_texture: { value: glitchTexture },
            u_time: { value: 0 },
            u_opacity: { value: 0 },
            u_hue_color: { value: new Vector3(0, 0.0, 0.0) },
          }}
        />
      </RhombicDodecaedron>
    );
  },
  () => true
);

export default GlitchShader;
export const DynamicGlitchShader = dynamic<any>(() =>
  import('./component').then((mod) => mod.default)
);
