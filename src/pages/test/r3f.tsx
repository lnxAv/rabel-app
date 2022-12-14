import { Html, OrthographicCamera, Text, useScroll } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect, useRef, useState } from 'react';
import { Box3, MathUtils, Vector3 } from 'three';
import TypewriterComponent from 'typewriter-effect';

import { BoundaryHover } from '../../@components/r3fObjects/BoundaryHover';
import Globe, { GlobeSpinningFunc, GlobeState } from '../../@components/r3fObjects/globe';
import { GroupReffered, MeshReffered } from '../../@helpers/types';
import { xDamp } from '../../@helpers/x-damp';
import { XR3f } from '../x-page';

extend({ MeshLine, MeshLineMaterial });

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLine: ReactThreeFiber.Object3DNode<MeshLine, typeof MeshLine>;
      meshLineMaterial: ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */
const fontProps = {
  font: 'fonts/disket-mono-bold.woff',
  fontSize: 1,
  letterSpacing: -0.05,
  lineHeight: 0.7,
  strokeColor: 'white',
  strokeWidth: 0.01,
};

const SelectionArray = ['ABOUT', 'TOOLS', 'PRJCT', 'OTHER'];
const OptionButtonArray = ['PREV', 'NEXT'];

type TextBounds = {
  [k in string]: Box3;
};

type TextRef = {
  [k in string]: MeshReffered;
};

const R3f: XR3f<any> = () => {
  const isGlobeReady = useRef<boolean>(false);
  const globeSpinningFunc = useRef<GlobeSpinningFunc | null>(null);
  const globeGroupRef = useRef<GroupReffered>(null);
  const optionGroupRef = useRef<GroupReffered>(null);
  const textGroupRef = useRef<GroupReffered>(null);
  const textRefs = useRef<TextRef>({});
  const textBoundsRef = useRef<TextBounds>({});
  const [defaultBound, setDefaultBound] = useState<Box3 | undefined>(undefined);
  const [defaultCenter, setDefaultCenter] = useState<Vector3 | undefined>(undefined);
  const defaultBoundTimeout = useRef<number | undefined | ReturnType<typeof setTimeout>>(undefined);
  const toVecRef = useRef<Vector3>(new Vector3(0));
  const fromVecRef = useRef<Vector3>(new Vector3(0));
  const selected = useRef<string>('');
  const [globeState, setGlobeState] = useState<GlobeState>(GlobeState.Loading);
  const [hovered, setHovered] = useState<string | null>(null);

  const data = useScroll();
  const [{ width, height }, { height: pHeight }] = useThree((s) => [s.viewport, s.size]);

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const doGlobeFrame = (a2: number, topOffset: number, delta: number) => {
    if (!globeGroupRef.current) return;
    if (a2 < 0.001) {
      const defaultY = globeGroupRef.current.userData.defaultPosition[1];
      globeGroupRef.current.position.y = xDamp(
        globeGroupRef.current.position.y,
        defaultY,
        2,
        delta
      );
    } else {
      const a2Pos = -height * a2 + 0.6;
      const isReady = textGroupRef.current.position.y - 1.5 > globeGroupRef.current.position.y;
      if (!isReady) {
        globeGroupRef.current.position.y = xDamp(globeGroupRef.current.position.y, a2Pos, 2, delta);
      } else {
        globeGroupRef.current.position.y = xDamp(
          globeGroupRef.current.position.y,
          Math.max(
            Math.min(
              a2Pos + topOffset - textGroupRef.current.position.y - data.offset * height + 2.5,
              a2Pos
            ),
            -height * (data.pages - 1.9)
          ),
          3,
          delta
        );
      }
    }
  };

  const doTextFrame = (a1: number, a2: number, topOffset: number, delta: number) => {
    if (!textGroupRef.current) return;
    // horizontal animation
    if (a1 < 0.001) {
      textGroupRef.current.position.x = xDamp(textGroupRef.current.position.x, width * 2, 4, delta);
    } else {
      textGroupRef.current.position.x = xDamp(
        textGroupRef.current.position.x,
        (a1 - 1) * -width * 2,
        8,
        delta
      );
    }
    // vertical animation
    SelectionArray.every((elem, i) => {
      const textRef = textRefs.current[elem];
      if (!textRef?.position) return false;
      if (a2 < 0.001) {
        /* eslint-disable no-param-reassign */
        textRef.position.y = xDamp(textRef.position.y, 0, 4, delta);
      } else {
        const isReady = textRef.position.y > 0.9 * -i;
        const isSelected = selected.current === textRef.userData.selection;
        if (
          a2 < 0.99 ||
          (!isSelected && !isReady) ||
          topOffset > textGroupRef.current.position.y - i - 1
        ) {
          textRef.position.y = xDamp(textRef.position.y, Math.max(-i, -i * a2), 8, delta);
        } else if (isSelected && topOffset < textGroupRef.current.position.y - i - 1) {
          textRef.position.y = xDamp(
            textRef.position.y,
            Math.max(topOffset - textGroupRef.current.position.y + 1, -height * (data.pages - 3.3)),
            5,
            delta
          );
        }
      }
      return true;
    });
  };

  const doTextOptionFrame = (a2: number, delta: number) => {
    // Animate text Option at the end
    if (optionGroupRef.current) {
      const textOffset = (defaultBound?.max.y || 0) + (defaultBound?.min.y || 0);
      const textRef = textRefs.current[selected.current];
      OptionButtonArray.every((optionElem) => {
        const optionRef = textRefs.current[optionElem];
        if (!optionRef?.position) return false; // skip
        if (isGlobeReady.current) {
          optionRef.visible = true;
          optionRef.scale.x = xDamp(optionRef.scale.x, 1, 5, delta);
          optionRef.rotation.x = xDamp(
            optionRef.rotation.x,
            MathUtils.radToDeg(0) * delta,
            5,
            delta
          );
        } else if (!isGlobeReady.current && optionRef.visible) {
          // optionRef.visible = false;
          optionRef.scale.x = xDamp(optionRef.scale.x, 0, 5, delta);
          if (optionRef.scale.x <= 0.1) {
            optionRef.visible = false;
          }
          optionRef.rotation.x = xDamp(optionRef.rotation.x, MathUtils.radToDeg(0.25), 5, delta);
        } else {
          optionRef.visible = false;
        }
        return true; // next
      });
      // Position
      if (textRef?.position)
        optionGroupRef.current.position.y = xDamp(
          optionGroupRef.current.position.y,
          textRef.position.y + textOffset - 0.4,
          10,
          delta
        );
    }
  };

  const handleGlobeState = (elem: string | null) => {
    switch (elem) {
      case 'ABOUT':
        setGlobeState(GlobeState.About);
        break;
      case 'PRJCT':
        setGlobeState(GlobeState.Project);
        break;
      case 'TOOLS':
        setGlobeState(GlobeState.Tools);
        break;
      case 'OTHER':
        setGlobeState(GlobeState.Other);
        break;
      default:
        setGlobeState(GlobeState.Loading);
        break;
    }
  };

  useFrame((time, delta) => {
    const a1 = data.range(0.5 / 6, 0.07); // right-to-left
    const a2 = data.range(0.5 / 6 + 0.035, 1.85 / 5 - (1 / 4 + 0.035)); // move-to-bottom
    const stickyOffset = -height * ((data.pages - 1) * data.offset) + height * data.offset;
    isGlobeReady.current = data.visible(2.4 / 4, 0.7 / 4);
    if (isGlobeReady.current) {
      handleGlobeState(selected.current);
    } else if (!isGlobeReady.current && globeState !== GlobeState.Loading && a2 >= 0.99) {
      handleGlobeState(null);
    }
    doGlobeFrame(a2, stickyOffset, delta);
    doTextFrame(a1, a2, stickyOffset, delta);
    doTextOptionFrame(a2, delta);
  });

  const handleOnHovered = (hoveredElem: string, boxElem?: string) => {
    setHovered(hoveredElem);
    if (defaultBound) {
      setDefaultBound(undefined);
    }
    const vecElem = boxElem || hoveredElem;
    toVecRef.current = textRefs.current[vecElem || ''].position || null;
    fromVecRef.current = textRefs.current[vecElem || ''].position || null;
  };

  const handleOnHoveredLeave = (hoveredElem: string) => {
    setHovered(null);
    if (hoveredElem === selected.current) {
      selected.current = hoveredElem;
      setDefaultBound(textBoundsRef.current[hoveredElem]);
      setDefaultCenter(textRefs.current[selected.current || '']?.position || null);
      clearTimeout(defaultBoundTimeout.current);
    } else {
      clearTimeout(defaultBoundTimeout.current);
      defaultBoundTimeout.current = setTimeout(() => {
        setDefaultBound(textBoundsRef.current[hoveredElem]);
        setDefaultCenter(textRefs.current[selected.current || '']?.position || null);
      }, 500);
    }
    fromVecRef.current = textRefs.current[hoveredElem || '']?.position || null;
  };

  const handleOnSelected = (elem: string) => {
    clearTimeout(defaultBoundTimeout.current);
    selected.current = elem;
    // handleGlobeState(elem);
    setHovered(null);
    setDefaultBound(textBoundsRef.current[elem]);
    setDefaultCenter(textRefs.current[elem || '']?.position || null);
    fromVecRef.current = textRefs.current[elem || '']?.position || null;
  };

  const handleOnOption = (elem: string) => {
    clearTimeout(defaultBoundTimeout.current);
    let newSelection = SelectionArray.indexOf(selected.current);
    if (elem === 'NEXT') {
      newSelection++;
      newSelection %= SelectionArray.length;
    } else if (elem === 'PREV') {
      newSelection = newSelection === 0 ? SelectionArray.length - 1 : newSelection - 1;
    }
    handleGlobeState(SelectionArray[newSelection]);
    handleOnSelected(SelectionArray[newSelection]);
  };
  const handleOnOptionEnter = (elem: string) => {
    handleOnHovered(elem);
  };
  const handleOnOptionLeave = () => {
    handleOnHoveredLeave(selected.current);
  };

  const handleGetSpinningFunc = (func: GlobeSpinningFunc) => {
    globeSpinningFunc.current = func;
  };

  const handleDoSpinningFunc = (elem: string) => {
    if (!globeSpinningFunc.current) return;
    if (elem === 'PREV') {
      globeSpinningFunc.current('left', 1.5);
    } else {
      globeSpinningFunc.current('right', 1);
    }
  };

  return (
    <>
      <OrthographicCamera />
      <group position={[0, 0, 1]}>
        <Html
          style={{
            width: '100vw',
            fontSize: '27px',
            fontFamily: 'dot16, monospace',
            left: '-50vw',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100vw',
              maxWidth: '700px',
              margin: 'auto',
              padding: '5vw 5px',
              textAlign: 'left',
              borderLeft: '1px solid red',
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div style={{ position: 'absolute', left: '0px' }}>
                <p>{'>'}</p>
              </div>
              <span>
                <TypewriterComponent
                  options={{ loop: true, delay: 200, deleteSpeed: 100, cursor: '&block;' }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString('in develo')
                      .deleteChars(6)
                      .typeString('construnction  ')
                      .deleteChars(1)
                      .typeString('????????????????? ')
                      .pauseFor(500)
                      .deleteChars(2)
                      .typeString('??????')
                      .pauseFor(300)
                      .deleteChars(2)
                      .typeString('???????')
                      .pauseFor(300)
                      .deleteChars(3)
                      .typeString('????')
                      .pauseFor(500)
                      .start();
                  }}
                />
              </span>
            </div>
          </div>
        </Html>
      </group>
      <Globe
        ref={globeGroupRef}
        globeText={hovered}
        getSpinFunc={handleGetSpinningFunc}
        globeState={globeState || GlobeState.Loading}
      />
      <group
        ref={textGroupRef}
        position={[width * 2, -height + 3, -1]}
        scale={[Math.min(height / 3, width / 3), height / 5, 1]}
      >
        {SelectionArray.map((elem, i) => (
          <Text
            key={elem}
            ref={(ref: MeshReffered) => (textRefs.current[elem] = ref)}
            userData={{ selection: elem }}
            position={[0, -i, 0]}
            renderOrder={-5}
            anchorX="center"
            anchorY="middle"
            onClick={() => {
              data.el.scroll(0, pHeight * (2.7 * 1)); // pHeight * (posWanted * scrollDistance)
            }}
            onPointerUp={() => handleOnSelected(elem)}
            onPointerEnter={() => handleOnHovered(elem)}
            onPointerDown={() => handleOnHovered(elem)}
            onPointerLeave={() => handleOnHoveredLeave(elem)}
            onSync={(mesh) => {
              const blockBounds = { ...mesh.textRenderInfo.visibleBounds };
              textBoundsRef.current[elem] = new Box3(
                new Vector3(blockBounds[0], blockBounds[1], 0),
                new Vector3(blockBounds[2], blockBounds[3], 0)
              );
              if (i === 0) {
                selected.current = elem;
                setDefaultBound(textBoundsRef.current[elem]);
                setDefaultCenter(mesh.position);
              }
            }}
            {...fontProps}
            fillOpacity={selected.current === elem ? 1 : hovered === elem ? 0.5 : 0}
            strokeOpacity={selected.current === elem ? 1 : hovered === elem ? 0.5 : 1}
          >
            {elem}
          </Text>
        ))}
        <group
          ref={optionGroupRef}
          position={[0, 0, 0]}
          scale={[Math.min(height / 3, width / 3) / 2, height / 5 / 2, 1]}
        >
          {OptionButtonArray.map((elem, i) => (
            <Text
              key={elem}
              ref={(ref: MeshReffered) => (textRefs.current[elem] = ref)}
              position={[MathUtils.clamp(width / 2 - width * (1 - i), -1, 1), 0, -1]}
              renderOrder={-4}
              anchorX="center"
              anchorY="middle"
              scale={[0, 1, 1]}
              visible={false}
              onClick={() => handleDoSpinningFunc(elem)}
              onPointerUp={() => handleOnOption(elem)}
              onPointerEnter={() => handleOnOptionEnter(elem)}
              onPointerDown={() => handleOnOptionEnter(elem)}
              onPointerLeave={() => handleOnOptionLeave()}
              {...fontProps}
              fontSize={0.5}
              strokeWidth={0.005}
              fillOpacity={hovered === elem ? 1 : 0}
              strokeOpacity={hovered === elem ? 1 : 1}
            >
              {elem}
            </Text>
          ))}
        </group>
        <BoundaryHover
          box={hovered ? textBoundsRef.current[hovered] : defaultBound}
          to={hovered ? toVecRef.current : defaultCenter}
          from={!hovered ? fromVecRef.current : undefined}
        />
      </group>
    </>
  );
};

export default R3f;
