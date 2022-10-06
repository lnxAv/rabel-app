import { Preload } from '@react-three/drei';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { uniqueId } from 'lodash';
import dynamic from 'next/dynamic';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

import { useGlobalStore } from '../../../@helpers/x-store';
import { XPerf } from '../x-perf/component';
import { DynamicScrollableHtml } from './scrollableHtml/component';
import XCanvasWrapper, { fullScreenStyle } from './styled';
import { XCanvasProps } from './types';

export const DynamicXCanvas = dynamic<XCanvasProps & CanvasProps>(() => import('./component'), {
  ssr: true,
  suspense: true,
});

// Offer a special canvas injected with features
export const XCanvas: React.FC<XCanvasProps & CanvasProps> = ({
  html,
  children,
  style,
  color,
  fullscreen,
  ...props
}) => {
  const [canvasId, setCanvasId] = useState<string>('');
  const [app, selectedCanvas, setSelectedCanvas] = useGlobalStore((state) => [
    state.app,
    state.selectedCanvas,
    state.setSelectedCanvas,
  ]);

  useEffect(() => {
    setCanvasId(uniqueId('canvas-'));
  }, []);

  const handleSelection = () => {
    // TODO : pass canvas ref instead ??
    setSelectedCanvas(canvasId !== selectedCanvas ? canvasId : '');
  };
  const memoScroll = useMemo(() => (html ? <DynamicScrollableHtml {...html} /> : null), [html]);

  return (
    <XCanvasWrapper style={fullscreen ? fullScreenStyle : style} devMode={app.devMode}>
      <button type="button" id="canvas-toggle" onClick={handleSelection}>
        {canvasId || ''}
      </button>
      <Canvas {...props}>
        <Preload />
        <Suspense>
          {color ? <color attach="background" args={[color]} /> : null}
          {app.devMode ? <XPerf id={canvasId} /> : null}
          <group>{children}</group>
          {memoScroll}
        </Suspense>
      </Canvas>
    </XCanvasWrapper>
  );
};

export default XCanvas;
