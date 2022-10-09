import React from 'react';
import { useThree } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useGlobalStore } from '../../../../@helpers/x-store';
import { XCanvasScrollable } from '../types';

// Offer a r3f scroll injected with features
export const DynamicScrollableHtml = dynamic<XCanvasScrollable & { children?: React.ReactNode }>(
  () => import('./component').then((mod) => mod.ScrollableHtml)
);

export function ScrollableHtml({
  scrollControls,
  htmlContent,
  children,
}: XCanvasScrollable & { children?: React.ReactNode }) {
  const [router] = useGlobalStore((state) => [state.router]);
  const { size } = useThree();

  return (
    <mesh>
      <ScrollControls key={router?.pathname} {...scrollControls}>
        {scrollControls?.scrollR3f ? <Scroll>{children}</Scroll> : null}
        <Scroll html>
          <div
            className="xcanvas-scroll-wrapper"
            style={{
              height: size.height,
              width: size.width,
            }}
          >
            <div
              style={
                !scrollControls?.pages
                  ? {
                      minHeight: '100vh',
                      maxHeight: '100vh',
                      overflow: 'auto',
                    }
                  : undefined
              }
            >
              {htmlContent}
            </div>
          </div>
        </Scroll>
      </ScrollControls>
    </mesh>
  );
}
export default ScrollableHtml;
