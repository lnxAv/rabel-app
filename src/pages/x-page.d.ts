import { ScrollControlsProps } from '@react-three/drei';
import { MotionProps } from 'framer-motion';
import { NextComponentType } from 'next';

// Page extension for the r3f background on a page
type XPage<P = {}, IP = P> = NextComponentType<P, IP> & {
  title?: string;
  withR3f?: XR3f<P>;
  htmlMotion?: MotionProps;
};

type XR3f<P = {}> = React.FC<P> & {
  motion?: MotionProps;
  scrollControls?: Partial<ScrollControlsProps & { scrollR3f: boolean }>;
};
