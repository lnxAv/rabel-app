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

const Globe = React.forwardRef<GroupReffered, any>((props, ref) => {
  const globeRef = useRef<GroupReffered>(null);
  const [vertical, setVertical] = useState<number>(0);
  const verticalRef = useRef<number>(0);
  const horizontalRef = useRef<number>(0);
  const [startBlur, setStartBlur] = useState<boolean>(true);
  const windowFocus = useRef<boolean>(false);
  const [{ width: pWidth, height: pHeight }] = useThree((s) => [s.size]);

  const updateMouse = (e: any) => {
    if (!windowFocus.current) {
      windowFocus.current = true;
    }
    const newHorizontal = (pWidth - e.x) / pWidth;
    const newVertical = (pHeight - e.y) / pHeight;
    horizontalRef.current = newHorizontal;
    verticalRef.current = newVertical;
  };

  useEffect(() => {
    const handleActivityFalse = () => {
      setStartBlur(true);
    };
    const handleActivityTrue = () => {
      windowFocus.current = true;
      setStartBlur(false);
    };

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
    globeRef.current.rotation.y = MathUtils.degToRad(horizontalRef.current * 360);
    setVertical(verticalRef.current);
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
    <group position={[0, 0.5, 0]} ref={ref} userData={{ defaultPosition: [0, 0.5, 0] }} scale={1.4}>
      <mesh rotation={[0, -0.6, 0]}>
        <group ref={globeRef}>
          {/* @ts-ignore */}
          <Sphere args={[...Object.values(GlobeSettings.args)]} scale={GlobeSettings.defaultScale}>
            <CartesianShader u={{ hue: [255, 0, 41], sharpness: 0.5, opacityA: 1.5 }} />
          </Sphere>
          <RhombicDodecaedronLines color="rgba(255, 0, 41, 0)" scale={0.45} opacity={0} />
          <LoadingGlobe
            phiLength={GlobeSettings.args.phiLength}
            thetaLength={GlobeSettings.args.thetaLength}
          />
        </group>
        <Html transform scale={[0.2, 0.2, 0.2]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <BreathingBox
            style={{
              transform: 'rotate(90deg) translate(-20px, 0)',
              pointerEvents: 'none',
              fontFamily: 'disket-mono-bold, monospace',
            }}
          >
            <CircleText
              text={props.globeText}
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
