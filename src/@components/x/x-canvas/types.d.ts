import { ScrollControlsProps } from '@react-three/drei';
import { CSSProperties } from 'react';

type XCanvasProps = {
  children: React.ReactNode;
  html?: XCanvasScrollable;
  style?: CSSProperties;
  fullscreen?: boolean;
};

type XCanvasScrollable = {
  htmlContent: JSX.Element | NextComponentType;
  scrollControls?: Partial<ScrollControlsProps & { scrollR3f: boolean }>;
};
