/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import { useGLTF } from '@react-three/drei';
import React from 'react';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    ['6c9a3991-6b77-4d4c-99c0-df39f4d21a8c_0']: THREE.Mesh;
  };
  materials: {
    ['6c9a3991-6b77-4d4c-99c0-df39f4d21a8c_0']: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('three/me_medium.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes['6c9a3991-6b77-4d4c-99c0-df39f4d21a8c_0'].geometry}
        material={materials['6c9a3991-6b77-4d4c-99c0-df39f4d21a8c_0']}
      />
    </group>
  );
}
useGLTF.preload('three/me_medium.glb');

export default Model;