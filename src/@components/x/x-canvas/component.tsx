import { Preload, ScrollControls } from '@react-three/drei';
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

  const memoR3f = useMemo(() => (children ? <group>{children}</group> : null), [children]);
  // If scrollableR3F Dusplay in ScrollControls else display outside
  const memoScrollHtml = useMemo(
    () =>
      html ? (
        <DynamicScrollableHtml {...html}>
          {html?.scrollControls?.scrollR3f ? <group>{memoR3f}</group> : null}
        </DynamicScrollableHtml>
      ) : null,
    [html, ScrollControls]
  );

  return (
    <XCanvasWrapper style={fullscreen ? fullScreenStyle : style} devMode={app.devMode}>
      <button type="button" id="canvas-toggle" onClick={handleSelection}>
        {canvasId || ''}
      </button>
      <Canvas
        {...props}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ mixBlendMode: 'difference' }}
      >
        <Preload />
        <Suspense>
          {color ? <color attach="background" args={[color]} /> : null}
          {app.devMode ? <XPerf id={canvasId} /> : null}
          {html?.scrollControls?.scrollR3f ? null : <group>{children}</group>}
          {memoScrollHtml}
        </Suspense>
      </Canvas>
    </XCanvasWrapper>
  );
};

export default XCanvas;
