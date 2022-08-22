import React, {
  Suspense, useEffect, useMemo, useRef, useState,
} from 'react';
import { useControls, useCreateStore } from 'leva';
import { StoreType } from 'leva/dist/declarations/src/types';
import dynamic from 'next/dynamic';
import { useGlobalStore } from '../../../@helpers/x-store';

// @refresh reset

const LevaPanel = dynamic<any>(() => import('leva').then((module) => module.LevaPanel));

// Renders gui store asigned -
export function XGUI() {
  const guiStore = useRef(useGlobalStore.getState().guiStore);
  useEffect(() => {
    useGlobalStore.subscribe((state) => (guiStore.current = state.guiStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const memoGUI = useMemo(
    () => (guiStore.current?.storeId ? (
      <Suspense>
        <LevaPanel
          theme={{
            colors: {
              elevation1: '#22222bf7;',
              elevation2: '#3a404535;',
            },
          }}
          store={guiStore.current}
          titleBar={{ title: `store : ${guiStore.current?.storeId}` }}
        />
      </Suspense>
    ) : null),
    [guiStore.current?.storeId],
  );
  return memoGUI;
}

// Create a gui store to be assigned -
function useGUIControlsDevelopment(initialProps?: any): [StoreType, any] {
  const [store] = useState(useCreateStore()); // new store for the given props
  const guiStore = useRef(useGlobalStore.getState().guiStore);
  useEffect(() => {
    useGlobalStore.subscribe((state) => (guiStore.current = state.guiStore));
    return () => {
      store.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // From: https://codesandbox.io/s/ny3p4?file=/src/App.js
  // User: drcmda
  // Hacky workaround to trick Leva into being able to handle mutiple stores ...
  const materialProps = useControls(
    Object.keys(initialProps).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...initialProps[key],
          transient: false,
        },
      }),
      {},
    ),
    { store },
    [guiStore.current],
  );
  return [store, materialProps as typeof initialProps];
}

// Return usable values given but without the store
function useGUIControlsProduction(initialProps: any): [null, any] {
  const getPureProps = () => Object.keys(initialProps).reduce(
    (acc, key) => ({
      ...acc,
      [key]: initialProps[key].value,
    }),
    {},
  );
  const [pureProps] = useState(getPureProps() || {});

  return [null, pureProps];
}

export function useGUIControls(
  initialProps?: any,
  ignoreDevMode?: boolean,
): [StoreType | null, any] {
  const [app] = useGlobalStore((state) => [state.app]);
  const [initDevMode] = useState<boolean>(!!ignoreDevMode);
  // For the sake of performace, switching ignoreDevMode will give errors & require to re-mount
  /* eslint-disable */
  useEffect(() => {
    console.warn(
      'For the sake of performace, switching ignoreDevMode will give errors & require to re-mount'
    )
  }, [ignoreDevMode])

  if (app.devMode || initDevMode) {
    try {
      return useGUIControlsDevelopment(initialProps)
    } catch (error) {
      console.warn('== Force refresh == ' + error)
      return [null, {}]
    }
  } else {
    try {
      return useGUIControlsProduction(initialProps)
    } catch (error) {
      console.warn('== Force refresh == ', error)
      return [null, {}]
    }
  }
  /* eslint-enable */
}
