import '../@styles/globals.css';
import '../@styles/fonts.css';

import { AnimatePresence, motion as htmlMotion } from 'framer-motion';
import { motion as r3fMotion } from 'framer-motion-3d';
import { NextComponentType } from 'next';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { AppProps } from 'next/app';
import manifest from '../../manifest.json';
import { DynamicXCanvas } from '../@components/x/x-canvas/component';
import { XGUI } from '../@components/x/x-gui/component';
import { useGlobalStore } from '../@helpers/x-store';
import globalVariants from '../@styles/motion.variants';
import { XPage } from './x-page';

type XAppProps = AppProps & {
  Component: NextComponentType & XPage; // add auth type
};

function MyApp({ Component, pageProps }: XAppProps) {
  const router = useRouter();
  const [setRouter] = useGlobalStore((state) => [state.setRouter]);

  useEffect(() => {
    // Give access to router for r3f
    setRouter(router);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    // Turn's off the splash screen
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader');
      if (loader) loader.style.display = 'none';
    }
  }, []);

  return (
    <>
      <Head>
        {/* Dynamic headers */}
        <title>{pageProps.title || manifest.name}</title>
      </Head>
      <XGUI />
      {!Component.withR3f ? ( // if doesn't contain r3f, render HTML only
        <htmlMotion.div
          key={router.pathname}
          {...(Component.htmlMotion ? { ...Component.htmlMotion } : { ...globalVariants.default })}
        >
          <Component {...pageProps} />
        </htmlMotion.div>
      ) : Component.withR3f ? ( // if contain r3f, render canvas with injected HTML & R3F
        <DynamicXCanvas
          fullscreen
          html={{
            htmlContent: (
              <htmlMotion.div
                key={router.pathname}
                {...(Component.htmlMotion
                  ? { ...Component.htmlMotion }
                  : { ...globalVariants.default })}
              >
                <Component {...pageProps} />
              </htmlMotion.div>
            ),
            scrollControls: Component?.withR3f?.scrollControls,
          }}
        >
          <AnimatePresence exitBeforeEnter>
            <r3fMotion.group
              key={router.pathname}
              {...(Component.withR3f.motion
                ? { ...Component.withR3f.motion }
                : { ...globalVariants.defaultScene })}
            >
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <Component.withR3f {...pageProps} />
            </r3fMotion.group>
          </AnimatePresence>
        </DynamicXCanvas>
      ) : null}
    </>
  );
}

export default appWithTranslation(MyApp);
