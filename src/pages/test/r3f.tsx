import { Edges, Html, Select } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';

import { useGUIControls } from '../../@components/x/x-gui/component';
import {
  RhombicDodecaedron,
  RhombicDodecaedronLines,
} from '../../@components/x/x-shapes/rhombic_dodecahedron';
import { GroupReffered } from '../../@helpers/types';
import { getGlobalState, useGlobalStore } from '../../@helpers/x-store';
import { DynamicGlitchShader } from '../../@styles/shader/glitch/component';
import { XR3f } from '../x-page';

function RhombicWithGui({
  color = 'white',
  thickness = 2,
  roughness = 0.65,
  envMapIntensity = 1,
  transmission = 0,
  metalness = 0,
  ...props
}: any) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [storeGUI] = useGlobalStore((state) => [state.guiStore]);
  const [store, { ...materialProps }] = useGUIControls(
    {
      color: { value: color },
      roughness: { value: roughness, min: 0, max: 1 },
      thickness: { value: thickness, min: -10, max: 10 },
      envMapIntensity: { value: envMapIntensity, min: 0, max: 10 },
      transmission: { value: transmission, min: 0, max: 1 },
      ...(metalness !== undefined && {
        metalness: { value: metalness, min: 0, max: 1 },
      }),
    },
    true,
  );
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const isSelected = !!store && store?.storeId === storeGUI?.storeId;
  return (
    <RhombicDodecaedron
      {...props}
      userData={{ store }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhysicalMaterial {...materialProps} />
      <Edges visible={isSelected} scale={1.1} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" depthTest={false} />
      </Edges>
      <Html style={{ pointerEvents: 'none', width: 100 }}>{'<XGui />'}</Html>
    </RhombicDodecaedron>
  );
}

const R3f: XR3f<any> = () => {
  const { setGUIStore } = getGlobalState();
  const groupRef = useRef<GroupReffered>(null);

  useFrame((time, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += -0.6 * delta;
    }
  });

  return (
    <>
      <ambientLight />
      <group ref={groupRef} position={[0, 0, 0]}>
        <RhombicDodecaedron scale={1} position={[0, -2.5, -2.5]}>
          <meshPhysicalMaterial
            color="#E3DAC9"
            transmission={1}
            thickness={0}
            envMapIntensity={0}
            roughness={0}
          />
        </RhombicDodecaedron>
        <RhombicDodecaedronLines
          color="#d92357"
          scale={0.5}
          lineWidth={3}
          position={[-2, 0, 2]}
        />
        <RhombicDodecaedron scale={1} position={[-2, -2.5, 2]}>
          <meshPhysicalMaterial
            color="#97c995"
            transmission={1}
            thickness={0}
            envMapIntensity={0}
            roughness={0}
          />
        </RhombicDodecaedron>
        <Select
          box
          onChange={(obj) => {
            setGUIStore(obj[0]?.userData?.store);
          }}
        >
          <RhombicWithGui
            color="#e39ebd"
            position={[2.5, 0, 2]}
            transmission={0.9}
            envMapIntensity={0.5}
            metalness={0.4}
          />
        </Select>
        <RhombicDodecaedron scale={1} position={[2.5, -2.5, 2]}>
          <meshPhysicalMaterial
            color="#E3DAC9"
            transmission={1}
            thickness={0}
            envMapIntensity={0}
            roughness={0}
          />
        </RhombicDodecaedron>
        <DynamicGlitchShader position={[0, 0, -2.5]} />
      </group>
    </>
  );
};

R3f.motion = {
  initial: {
    y: 0,
    x: -5,
    scale: 0,
  },
  animate: {
    y: 0,
    x: 0,
    scale: 1,
  },
  exit: {
    x: 5,
    y: 1,
    scale: 0,
  },
};

R3f.scrollControls = {
  pages: 2,
  damping: 4,
};

export default R3f;
