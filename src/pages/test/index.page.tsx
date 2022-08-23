import { motion } from 'framer-motion';
import Head from 'next/head';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { XPage } from '../x-page';
import R3f from './r3f';

const Div = styled(motion.div)`
  position: relative;
  padding: 24px;
  padding-top: 50px;
  width: 50vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  @media only screen and (max-width: 620px) {
    width: 100vw;
  }
`;

const Test: XPage = ({ title }: any) => {
  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Div>xx</Div>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      locale,
    },
  };
}

Test.R3f = R3f;

Test.htmlMotion = {
  initial: {
    opacity: 0,
    y: -5,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -5,
  },
};

export default Test;
