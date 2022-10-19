import { Cylinder, Html, Sphere } from '@react-three/drei';
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
export enum GlobeState {
  Loading,
  About,
  Tools,
  Project,
  Other,
}

type Props = {
  globeText?: string | null;
  globeState?: GlobeState;
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
  const bodyRef = useRef<GroupReffered>(null);
  const contentRef = useRef<GroupReffered>(null);
  const [vertical, setVertical] = useState<number>(0); // is needed to update frame
  const verticalRef = useRef<number>(0); // vertical-mouse
  const horizontalRef = useRef<number>(0); // horizontal-mouse
  const [startBlur, setStartBlur] = useState<boolean>(true);
  const isSpinning = useRef<boolean>(false);
  const spinningTo = useRef<number>(0);
  const switchingStateTo = useRef<GlobeState | null>(null);
  const currentState = useRef<GlobeState>(GlobeState.Loading);
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
      spinningTo.current = rad + bodyRef.current.rotation.y;
    } else {
      isSpinning.current = false;
      globeRef.current.rotation.y -= spinningTo.current;
      contentRef.current.rotation.y = globeRef.current.rotation.y;
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

  useEffect(() => {
    switchingStateTo.current = props.globeState || GlobeState.Loading;
  }, [props.globeState]);
  const updateFrame = (delta: number) => {
    verticalRef.current += 0.3 * delta;
    verticalRef.current %= 1;
    setVertical(verticalRef.current);
    globeRef.current.rotation.y += 0.2 * delta;
    contentRef.current.rotation.y = globeRef.current.rotation.y;
  };

  const updateFrameMouse = () => {
    setVertical(verticalRef.current);
    if (!isSpinning.current) {
      globeRef.current.rotation.y = MathUtils.degToRad(horizontalRef.current * 360);
      contentRef.current.rotation.y = globeRef.current.rotation.y;
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
      contentRef.current.rotation.y = globeRef.current.rotation.y;

      if (globeRef.current.rotation.y.toPrecision(1) === spinningTo.current.toPrecision(1)) {
        startSpinning(null);
      }
    }
  };

  const a = MathUtils.damp; // short

  const frameStateLoading = (delta: number) => {
    if (!bodyRef.current) return;
    if (
      switchingStateTo.current === GlobeState.Loading ||
      switchingStateTo.current === GlobeState.Other
    ) {
      bodyRef.current.position.y = a(bodyRef.current.position.y, 0, 4, delta);
      bodyRef.current.scale.x = a(bodyRef.current.scale.x, 1, 4, delta);
      bodyRef.current.scale.y = a(bodyRef.current.scale.y, 1, 4, delta);
      bodyRef.current.scale.z = a(bodyRef.current.scale.z, 1, 4, delta);
      // globeRef.current.scale.set(1, 1, 1);
      globeRef.current.scale.x = a(globeRef.current.scale.x, 1, 4, delta);
      globeRef.current.scale.y = a(globeRef.current.scale.y, 1, 4, delta);
      globeRef.current.scale.z = a(globeRef.current.scale.z, 1, 4, delta);
      // after x amount of time
      currentState.current = GlobeState.Loading;
      // switchingStateTo.current = null;
    }
  };

  const frameStateAbout = (delta: number) => {
    if (!bodyRef.current) return;
    if (switchingStateTo.current === GlobeState.About) {
      // body
      bodyRef.current.position.y = a(bodyRef.current.position.y, 0.8, 4, delta);
      bodyRef.current.scale.x = a(bodyRef.current.scale.x, 0.7, 4, delta);
      bodyRef.current.scale.y = a(bodyRef.current.scale.y, 0.7, 4, delta);
      bodyRef.current.scale.z = a(bodyRef.current.scale.z, 0.7, 4, delta);
      // globe
      globeRef.current.scale.x = a(globeRef.current.scale.x, 0, 4, delta);
      globeRef.current.scale.y = a(globeRef.current.scale.y, 0, 4, delta);
      globeRef.current.scale.z = a(globeRef.current.scale.z, 0, 4, delta);
      // after x amount of time
      currentState.current = GlobeState.About;
      // switchingStateTo.current = null;
    }
  };

  const frameStateTools = (delta: number) => {
    if (!bodyRef.current) return;
    if (switchingStateTo.current === GlobeState.Tools) {
      bodyRef.current.position.y = a(bodyRef.current.position.y, 0, 4, delta);
      bodyRef.current.scale.x = a(bodyRef.current.scale.x, 1, 4, delta);
      bodyRef.current.scale.y = a(bodyRef.current.scale.y, 1, 4, delta);
      bodyRef.current.scale.z = a(bodyRef.current.scale.z, 1, 4, delta);
      // globeRef.current.scale.set(1, 1, 1);
      globeRef.current.scale.x = a(globeRef.current.scale.x, 0.9, 4, delta);
      globeRef.current.scale.y = a(globeRef.current.scale.y, 0.9, 4, delta);
      globeRef.current.scale.z = a(globeRef.current.scale.z, 0.9, 4, delta);
      // after x amount of time
      currentState.current = GlobeState.Tools;
      // switchingStateTo.current = null;
    }
  };

  const frameStateProjects = (delta: number) => {
    if (!bodyRef.current) return;
    if (switchingStateTo.current === GlobeState.Project) {
      bodyRef.current.position.y = a(bodyRef.current.position.y, 0, 4, delta);
      bodyRef.current.scale.x = a(bodyRef.current.scale.x, 1.1, 4, delta);
      bodyRef.current.scale.y = a(bodyRef.current.scale.y, 1.1, 4, delta);
      bodyRef.current.scale.z = a(bodyRef.current.scale.z, 1.1, 4, delta);
      // globeRef.current.scale.set(1, 1, 1);
      globeRef.current.scale.x = a(globeRef.current.scale.x, 1.1, 4, delta);
      globeRef.current.scale.y = a(globeRef.current.scale.y, 1.1, 4, delta);
      globeRef.current.scale.z = a(globeRef.current.scale.z, 1.1, 4, delta);
      // after x amount of time
      currentState.current = GlobeState.Project;
      // switchingStateTo.current = null;
    }
  };

  const doStateFrameLoop = (delta: number) => {
    switch (switchingStateTo.current) {
      case GlobeState.About:
        frameStateAbout(delta);
        break;
      case GlobeState.Tools:
        frameStateTools(delta);
        break;
      case GlobeState.Project:
        frameStateProjects(delta);
        break;
      case GlobeState.Loading:
      default:
        frameStateLoading(delta);
        break;
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
    doStateFrameLoop(delta);
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
      <group ref={bodyRef} rotation={[0, -0.6, 0]}>
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
          <group visible={props.globeState === GlobeState.Loading}>
            <LoadingGlobe
              phiLength={GlobeSettings.args.phiLength}
              thetaLength={GlobeSettings.args.thetaLength}
            />
          </group>
        </group>
        <group ref={contentRef} visible={props.globeState !== GlobeState.Loading}>
          <group visible={props.globeState === GlobeState.About}>
            <Cylinder />
          </group>
        </group>
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
      </group>
    </group>
  );
});

export default Globe;
