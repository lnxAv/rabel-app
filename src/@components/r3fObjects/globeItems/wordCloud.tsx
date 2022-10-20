import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePoolStore } from '../../../@helpers/poolStore';
import { MeshReffered } from '../../../@helpers/types';
import {
  PoolableComponent,
  PoolItemCreationProps,
  useObjectPool,
} from '../../x/extension/pool/pool';

type Props = {
  phiLength: number;
  thetaLength: number;
};
const wordList = [
  'javaScript',
  'React',
  'vue.js',
  'SQL',
  'Node.js',
  'GraphQl',
  'ThreeJs',
  'glTF',
  'MySQL',
  'ES6+',
  'HTML',
  'JAVA',
  'typeScript',
];
const Test = styled.div`
  :hover {
    color: red;
    cursor: pointer;
  }
`;

const getNumber = () =>
  Math.max(Math.min((Math.round(Math.random()) - 0.5) * Math.random() - 0.2, -0.2), 0.2);
const Instance: PoolableComponent = ({ context }: PoolItemCreationProps) => {
  const uniqueDirection = useRef<number>(getNumber());
  const items = useRef(usePoolStore.getState()[context.key]);
  const mesh = useRef<MeshReffered>(null);
  useEffect(() => {
    usePoolStore.subscribe((state) => (items.current = state[context.key]));
  }, []);

  useFrame((time, delta) => {
    const newPhi = (items.current?.itemProps.phi || 0) + uniqueDirection.current * delta;
    const newTheta = (items.current?.itemProps.theta || 0) + -uniqueDirection.current * delta;
    context.update({
      phi: newPhi,
      theta: newTheta,
    });
    if (mesh.current) {
      mesh.current.position.setFromSphericalCoords(1.01, newPhi, newTheta);
    }
  });

  return (
    <mesh key={context.key} ref={mesh} scale={0.7}>
      <Html transform sprite>
        <Test>{items.current?.itemProps.word}</Test>
      </Html>
    </mesh>
  );
};

const WordGlobe = ({ phiLength, thetaLength }: Props) => {
  const pool = useObjectPool(Instance, {
    initialProps: () => ({
      phi: Math.random() * thetaLength,
      theta: Math.random() * phiLength,
      word: '',
    }),
    reserve: wordList.length,
    activeAtStart: 0,
    limit: 50,
  });
  useEffect(() => {
    wordList.forEach((word, i) => {
      pool.addCustomPoolItem(Instance, () => ({
        phi: Math.random() * thetaLength + Math.random() * i,
        theta: Math.random() * phiLength + i,
        word,
      }));
    });
  }, []);
  return (
    <group renderOrder={-1}>
      {pool.activeMap((poolItem) => poolItem.object)}
      <fog attach="fog" args={['#0101ff', 0, 1]} />
    </group>
  );
};

export default WordGlobe;
