import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { MeshReffered } from '../../@helpers/types';

import GlobeEffectHtml from '../htmlObjects/globeEffectHtml';
import { PoolableComponent, PoolItemCreationProps, useObjectPool } from '../x/extension/pool/pool';
import { usePoolStore } from '../../@helpers/poolStore';

type Props = {
  phiLength: number;
  thetaLength: number;
};

const Instance: PoolableComponent = ({ context }: PoolItemCreationProps) => {
  const items = useRef(usePoolStore.getState()[context.key]);
  const mesh = useRef<MeshReffered>(null);
  useEffect(() => {
    usePoolStore.subscribe((state) => (items.current = state[context.key]));
  }, []);

  useFrame((time, delta) => {
    const newPhi = (items.current?.itemProps.phi || 0) + 0.2 * delta;
    const newTheta = (items.current?.itemProps.theta || 0) + 0.2 * delta;
    context.update({
      phi: newPhi,
      theta: newTheta,
    });
    if (mesh.current) {
      mesh.current.position.setFromSphericalCoords(1.01, newPhi, newTheta);
    }
  });

  return (
    <mesh key={context.key} ref={mesh}>
      <Html occlude style={{ pointerEvents: 'none' }}>
        <GlobeEffectHtml title="> loading" />
      </Html>
    </mesh>
  );
};

const LoadingGlobe = ({ phiLength, thetaLength }: Props) => {
  const pool = useObjectPool(Instance, {
    initialProps: () => ({
      phi: Math.random() * thetaLength,
      theta: Math.random() * phiLength,
    }),
    reserve: 5,
    activeAtStart: 50,
    limit: 50,
  });

  return <group renderOrder={-1}>{pool.activeMap((poolItem) => poolItem.object)}</group>;
};

export default LoadingGlobe;
