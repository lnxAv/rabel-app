import { Html, Sphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { MathUtils } from 'three';

import { GroupReffered } from '../../@helpers/types';
import CartesianShader from '../../@styles/shader/cartesian/component';
import { BreathingBox, CircleText } from '../htmlObjects/globeEffectHtml';
import { RhombicDodecaedronLines } from '../x/x-shapes/rhombic_dodecahedron';
import AnimatedLine from './animatedLine';
import LoadingGlobe from './loadingGlobe';

export type GlobeSpinningFunc = (direction: 'left' | 'right' | null, amount?: number) => void;
type Props = {
  globeText?: string | null;
  getSpinFunc?: (func: (direction: 'left' | 'right' | null, amount?: number) => void) => void;
};

const GlobeSettings = {
  args: {
    radius: 0.9,
    widthSegment: 32,
    heightSegment: 15,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
  },
  defaultScale: 1.1,
  defaultPos: [0, 0, 0],
};

const Globe = React.forwardRef<GroupReffered, Props>((props, ref) => {
  const globeRef = useRef<GroupReffered>(null);
  const [vertical, setVertical] = useState<number>(0); // is needed to update frame
  const verticalRef = useRef<number>(0); // vertical-mouse
  const horizontalRef = useRef<number>(0); // horizontal-mouse
  const [startBlur, setStartBlur] = useState<boolean>(true);
  const isSpinning = useRef<boolean>(false);
  const spinningTo = useRef<number>(0);
  // const [isBlinking, setIsBlinking] = useState<boolean>(true);
  // const [bingAmount, setBlinkingAmount] = useState<boolean>(true);
  const windowFocus = useRef<boolean>(false);
  const [{ width: pWidth, height: pHeight }] = useThree((s) => [s.size]);

  const updateMouse = (e: any) => {
    if (!windowFocus.current) {
      windowFocus.current = true;
    }
    const newHorizontal = (pWidth - e.x) / pWidth;
    horizontalRef.current = newHorizontal;
    const newVertical = (pHeight - e.y) / pHeight;
    verticalRef.current = newVertical;
  };

  const startSpinning = (direction: 'left' | 'right' | null, amount?: number) => {
    if (direction === 'left' || direction === 'right') {
      const spin = amount || 1;
      const path = direction === 'left' ? 1 : -1;
      const rad = MathUtils.degToRad(360 * spin * path);
      isSpinning.current = true;
      spinningTo.current = rad + globeRef.current.rotation.y;
    } else {
      isSpinning.current = false;
      globeRef.current.rotation.y -= spinningTo.current;
    }
  };

  useEffect(() => {
    const handleActivityFalse = () => {
      setStartBlur(true);
    };
    const handleActivityTrue = () => {
      windowFocus.current = true;
      setStartBlur(false);
    };

    if (props.getSpinFunc) {
      props.getSpinFunc(startSpinning);
    }

    window.addEventListener('mousemove', updateMouse);
    document.addEventListener('mouseout', handleActivityFalse);
    document.addEventListener('touchend', handleActivityFalse);
    document.addEventListener('touchcancel', handleActivityFalse);

    document.addEventListener('visibilitychange', (e) =>
      !e ? handleActivityFalse() : handleActivityTrue()
    );
    document.addEventListener('blur', handleActivityFalse);
    document.addEventListener('focus', handleActivityTrue);
  }, []);

  const updateFrame = (delta: number) => {
    verticalRef.current += 0.3 * delta;
    verticalRef.current %= 1;
    setVertical(verticalRef.current);
    globeRef.current.rotation.y += 0.2 * delta;
  };

  const updateFrameMouse = () => {
    setVertical(verticalRef.current);

    if (!isSpinning.current) {
      globeRef.current.rotation.y = MathUtils.degToRad(horizontalRef.current * 360);
    }
  };

  const doSpinningFrame = (delta: number) => {
    if (isSpinning.current) {
      const strength =
        spinningTo.current > 0
          ? Math.max(spinningTo.current / Math.PI, 10)
          : Math.min(Math.abs(spinningTo.current) / Math.PI, -10);
      const step = strength * delta;
      globeRef.current.rotation.y += step;
      if (globeRef.current.rotation.y.toPrecision(1) === spinningTo.current.toPrecision(1)) {
        startSpinning(null);
      }
    }
  };

  useFrame((time, delta) => {
    if (!windowFocus.current && !startBlur) {
      updateFrame(delta);
    } else if (startBlur) {
      verticalRef.current = vertical;
      setVertical(verticalRef.current);
      windowFocus.current = false;
      setStartBlur(false);
    } else {
      updateFrameMouse();
    }
    doSpinningFrame(delta);
  });

  const animatedLineWidth = (
    value: number,
    check: number,
    precision: number,
    width: number,
    minWidth: number = 0
  ) => {
    const precisionValidity = value >= check - precision && value <= check + precision;
    if (!precisionValidity) {
      return minWidth;
    }
    if (precision === 0) {
      return width;
    }
    const halfDistance = Math.abs(value - check);
    const distancePercentage = ((halfDistance / precision) * Math.PI) / 2;
    const newWidth = width * Math.cos(distancePercentage);
    return newWidth;
  };

  return (
    <group
      position={[0, 0.5, 0.2]}
      ref={ref}
      userData={{ defaultPosition: [0, 0.5, 0] }}
      scale={1.4}
    >
      <mesh rotation={[0, -0.6, 0]}>
        <group ref={globeRef}>
          {/* @ts-ignore */}
          <Sphere args={[...Object.values(GlobeSettings.args)]} scale={GlobeSettings.defaultScale}>
            <CartesianShader u={{ hue: [255, 0, 41], sharpness: 0.5, opacityA: 1.5 }} />
          </Sphere>
          <RhombicDodecaedronLines
            color="rgb(255, 0, 41)"
            scale={0.45}
            opacity={0}
            renderOrder={10}
          />
        </group>
        <LoadingGlobe
          phiLength={GlobeSettings.args.phiLength}
          thetaLength={GlobeSettings.args.thetaLength}
        />
        <Html>
          <button type="button" onClick={() => startSpinning('left', 1)}>
            xxx
          </button>
        </Html>
        <Html transform scale={0.2} position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
          <BreathingBox
            style={{
              transform: 'rotate(90deg) translate(-20px, 0)',
              pointerEvents: 'none',
              fontFamily: 'disket-mono-bold, monospace',
            }}
          >
            <CircleText
              text={props.globeText || ''}
              arc={180}
              radius="250px"
              offset={-260}
              fontSize={50}
              color="red"
            />
          </BreathingBox>
        </Html>
        <AnimatedLine
          amplitude={1.3}
          angle={180}
          scale={1}
          rotation={[0, Math.cos(horizontalRef.current) - 0.8, -Math.PI / 2]}
          color="red"
          opacity={0.8}
          dashArray={0.01}
          dashRatio={0.5}
          widthCallback={(p: number) =>
            animatedLineWidth(
              verticalRef.current,
              p,
              0.01,
              Math.sin(horizontalRef.current / 2 + 0.5) * 0.2,
              Math.sin(horizontalRef.current / 2 + 0.5) * 0.01
            )
          }
        />
      </mesh>
    </group>
  );
});

export default Globe;
