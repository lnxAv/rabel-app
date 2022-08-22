import { ScrollControlsProps } from '@react-three/drei';
import { MotionProps } from 'framer-motion';
import { NextComponentType } from 'next';
import { ComponentType } from 'react';

// Page extension for the r3f background on a page
type XPage<P = {}, IP = P> = NextComponentType<P, IP> & {
  title?: string
  R3f?: XR3f<P>
  htmlMotion?: MotionProps
};

type XR3f<P = {}, IP = P> = ComponentType<P, IP> & {
  motion?: MotionProps
  scrollControls?: Partial<ScrollControlsProps>
};
