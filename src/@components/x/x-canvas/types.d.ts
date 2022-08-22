import { ScrollControlsProps } from '@react-three/drei';
import { CSSProperties } from 'react';

type XCanvasProps = {
  children: React.ReactNode
  html?: XCanvasScrollableHTML
  style?: CSSProperties
  fullscreen?: boolean
};

type XCanvasScrollableHTML = {
  content: JSX.Element | NextComponentType
  scrollControls?: Partial<ScrollControlsProps>
};
