import dynamic from 'next/dynamic';
import { PerfProps, usePerf } from 'r3f-perf';
import React, {
  Suspense, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { useGlobalStore } from '../../../@helpers/x-store';
import { Props } from './types';

const Perf = dynamic<PerfProps>(() => import('r3f-perf').then((module) => module.Perf));
const DynamicXPerfHook = dynamic<Props & PerfProps>(() => import('./component').then((mod) => mod.XPerfHook));
const StyledPerf = styled(Perf)`
  z-index: 999;
  margin-left: 70px;
  margin-top: 15px;
  &:hover {
    z-index: 997;
    opacity: 0.4;
  }
`;
export const XPerf: React.FC<Props & PerfProps> = ({
  id,
  ignoreDevMode = false,
  ...props
}) => {
  // Conditionally use r3f-Perf
  const [selectedCanvas, app] = useGlobalStore((state) => [
    state.selectedCanvas,
    state.app,
  ]);
  const condition: boolean = !!selectedCanvas && selectedCanvas === id && (app.devMode || ignoreDevMode);

  return condition ? (
    <Suspense>
      {/* @ts-ignore */}
      <StyledPerf
        position="top-left"
        minimal
        {...props}
        /* @ts-ignore */
        customData={{ value: 0, name: selectedCanvas, info: 'id' }}
      />
      <DynamicXPerfHook id={id} />
    </Suspense>
  ) : null;
};

export const XPerfHook: React.FC<Props> = ({ id }) => {
  // Conditionally Grab r3f-Perf values and set's it in the Global Store
  const [isReady, setIsReady] = useState<boolean>(true);
  const PERF = usePerf();
  const intervalRef = useRef<number>();
  const [setPerfData, selectedCanvas] = useGlobalStore((state) => [
    state.setPerfData,
    state.selectedCanvas,
  ]);

  const condition: boolean = !!selectedCanvas && selectedCanvas === id;

  const startUpdate = () => {
    setIsReady(false);
    const intervalId = window.setTimeout(() => {
      setPerfData(PERF);
      setIsReady(true);
    }, 300);
    intervalRef.current = intervalId;
  };

  const stopUpdate = () => {
    window.clearTimeout(intervalRef.current);
    setPerfData(undefined);
  };

  useEffect(() => {
    if (condition && isReady) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PERF]);

  useEffect(
    () => () => {
      stopUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [condition],
  );

  return null;
};
