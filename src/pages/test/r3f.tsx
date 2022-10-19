import { OrthographicCamera, Text, useScroll } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'meshline';
import React, { useEffect, useRef, useState } from 'react';
import { Box3, MathUtils, Vector3 } from 'three';

import { BoundaryHover } from '../../@components/r3fObjects/BoundaryHover';
import Globe, { GlobeSpinningFunc } from '../../@components/r3fObjects/globe';
import { GroupReffered, MeshReffered } from '../../@helpers/types';
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

const SelectionArray = ['ABOUT', 'TOOLS', 'PRJCT', 'REACH'];
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
  const [defaultBox, setDefaultBox] = useState<Box3 | undefined>(undefined);
  const [defaultX, setDefaultX] = useState<Vector3 | undefined>(undefined);
  const defaultBoxTimeout = useRef<number | undefined | ReturnType<typeof setTimeout>>(undefined);
  const toVecRef = useRef<Vector3>(new Vector3(0));
  const fromVecRef = useRef<Vector3>(new Vector3(0));
  const data = useScroll();
  const selected = useRef<string>('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [{ width, height }] = useThree((s) => [s.viewport, s.mouse]);

  const doGlobeFrame = (a2: number, topOffset: number, delta: number) => {
    if (!globeGroupRef.current) return;
    if (a2 < 0.001) {
      const defaultY = globeGroupRef.current.userData.defaultPosition[1];
      globeGroupRef.current.position.y = MathUtils.damp(
        globeGroupRef.current.position.y,
        defaultY,
        2,
        delta
      );
    } else {
      const a2Pos = -height * a2 + 0.6;
      const isReady = textGroupRef.current.position.y - 1.5 > globeGroupRef.current.position.y;
      if (!isReady) {
        globeGroupRef.current.position.y = MathUtils.damp(
          globeGroupRef.current.position.y,
          a2Pos,
          2,
          delta
        );
      } else {
        globeGroupRef.current.position.y = MathUtils.damp(
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
      textGroupRef.current.position.x = MathUtils.damp(
        textGroupRef.current.position.x,
        width * 2,
        4,
        delta
      );
    } else {
      textGroupRef.current.position.x = MathUtils.damp(
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
        textRef.position.y = MathUtils.damp(textRef.position.y, 0, 4, delta);
      } else {
        const isReady = textRef.position.y > 0.9 * -i;
        const isSelected = selected.current === textRef.userData.selection;
        if (
          a2 < 0.99 ||
          (!isSelected && !isReady) ||
          topOffset > textGroupRef.current.position.y - i - 1
        ) {
          textRef.position.y = MathUtils.damp(textRef.position.y, Math.max(-i, -i * a2), 8, delta);
        } else if (isSelected && topOffset < textGroupRef.current.position.y - i - 1) {
          textRef.position.y = MathUtils.damp(
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
      const textOffset = (defaultBox?.max.y || 0) + (defaultBox?.min.y || 0);
      const textRef = textRefs.current[selected.current];
      OptionButtonArray.every((optionElem) => {
        const optionRef = textRefs.current[optionElem];
        if (!optionRef?.position) return false; // skip
        if (isGlobeReady.current) {
          optionRef.visible = true;
          optionRef.scale.x = MathUtils.damp(optionRef.scale.x, 1, 5, delta);
          optionRef.rotation.x = MathUtils.damp(
            optionRef.rotation.x,
            MathUtils.radToDeg(0) * delta,
            5,
            delta
          );
        } else if (!isGlobeReady.current && optionRef.visible) {
          // optionRef.visible = false;
          optionRef.scale.x = MathUtils.damp(optionRef.scale.x, 0, 5, delta);
          if (optionRef.scale.x <= 0.1) {
            optionRef.visible = false;
          }
          optionRef.rotation.x = MathUtils.damp(
            optionRef.rotation.x,
            MathUtils.radToDeg(0.25),
            5,
            delta
          );
        } else {
          optionRef.visible = false;
        }
        return true; // next
      });
      // Position
      if (textRef?.position)
        optionGroupRef.current.position.y = MathUtils.damp(
          optionGroupRef.current.position.y,
          textRef.position.y + textOffset - 0.4,
          10,
          delta
        );
    }
  };
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((time, delta) => {
    const a1 = data.range(0.5 / 6, 0.07); // right-to-left
    const a2 = data.range(0.5 / 6 + 0.035, 1.85 / 5 - (1 / 4 + 0.035)); // move-to-bottom
    const stickyOffset = -height * ((data.pages - 1) * data.offset) + height * data.offset;
    isGlobeReady.current = data.visible(2.4 / 4, 0.7 / 4);
    doGlobeFrame(a2, stickyOffset, delta);
    doTextFrame(a1, a2, stickyOffset, delta);
    doTextOptionFrame(a2, delta);
  });

  const handleOnHovered = (hoveredElem: string, boxElem?: string) => {
    setHovered(hoveredElem);
    if (defaultBox) {
      setDefaultBox(undefined);
    }
    const vecElem = boxElem || hoveredElem;
    toVecRef.current = textRefs.current[vecElem || ''].position || null;
    fromVecRef.current = textRefs.current[vecElem || ''].position || null;
  };

  const handleOnHoveredLeave = (hoveredElem: string) => {
    setHovered(null);
    if (hoveredElem === selected.current) {
      selected.current = hoveredElem;
      setDefaultBox(textBoundsRef.current[hoveredElem]);
      setDefaultX(textRefs.current[selected.current || '']?.position || null);
      clearTimeout(defaultBoxTimeout.current);
    } else {
      clearTimeout(defaultBoxTimeout.current);
      defaultBoxTimeout.current = setTimeout(() => {
        setDefaultBox(textBoundsRef.current[hoveredElem]);
        setDefaultX(textRefs.current[selected.current || '']?.position || null);
      }, 500);
    }
    fromVecRef.current = textRefs.current[hoveredElem || '']?.position || null;
  };

  const handleOnSelected = (elem: string) => {
    clearTimeout(defaultBoxTimeout.current);
    selected.current = elem;
    setHovered(null);
    setDefaultBox(textBoundsRef.current[elem]);
    setDefaultX(textRefs.current[elem || '']?.position || null);
    fromVecRef.current = textRefs.current[elem || '']?.position || null;
  };

  const handleOnOption = (elem: string) => {
    clearTimeout(defaultBoxTimeout.current);
    let newSelection = SelectionArray.indexOf(selected.current);
    if (elem === 'NEXT') {
      newSelection++;
      newSelection %= SelectionArray.length;
    } else if (elem === 'PREV') {
      newSelection = newSelection === 0 ? SelectionArray.length - 1 : newSelection - 1;
    }
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
      <Globe ref={globeGroupRef} globeText={hovered} getSpinFunc={handleGetSpinningFunc} />
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
                setDefaultBox(textBoundsRef.current[elem]);
                setDefaultX(mesh.position);
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
          box={hovered ? textBoundsRef.current[hovered] : defaultBox}
          to={hovered ? toVecRef.current : defaultX}
          from={!hovered ? fromVecRef.current : undefined}
        />
      </group>
    </>
  );
};

export default R3f;
