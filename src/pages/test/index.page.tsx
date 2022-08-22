import { motion } from 'framer-motion';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';

import { useGlobalStore } from '../../@helpers/x-store';
import globalVariants from '../../@styles/motion.variants';
import { XPage } from '../x-page';
import R3f from './r3f';

const Div = styled(motion.div)`
  position: relative;
  padding: 25px;
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

const Test: XPage = ({ title, ...props }: any) => {
  const [router] = useGlobalStore((state) => [state.router]);
  // render data
  return (
    <>
      <Head>
        <title>Rhombic Dodecahedron</title>
      </Head>
      <Div {...globalVariants.default}>
        <h1>{title}</h1>
        {props.data?.map((content: any, i: number) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: content }} />
        ))}
        <br />
        +
        <br />
        +
        <br />
        +
        <motion.div style={{ position: 'absolute', bottom: 0 }}>
          <br />
          +
          <br />
          +
          <br />
          +
          <br />
          +
          <br />
          v
        </motion.div>
      </Div>
      <Div>
        <br />
        ^
        <br />
        +
        <br />
        +
        <div>
          Etiam ultricies lorem vel nisi luctus posuere. Phasellus ac tincidunt
          purus, non vehicula turpis.
        </div>
        <div>
          <a
            href="/test2"
            style={{ color: 'white' }}
            onClick={(e) => {
              e.preventDefault();
              router?.push('/test2');
            }}
          >
            {'< test2 />'}
          </a>
          <br />
          <a
            href={`${props.locale}/test`}
            onClick={(e) => {
              e.preventDefault();
              router?.push('/test', '/test', {
                locale: props.locale === 'en' ? 'fr' : 'en',
              });
            }}
          >
            {`< ${props.locale === 'en' ? 'fr' : 'en'} />`}
          </a>
          <br />
        </div>
      </Div>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  const title = locale === 'en' ? 'Rhombic_dodecahedron' : 'Dodécaèdre_rhombique';
  const url = `https://${locale}.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=${title}`;

  const res = await fetch(url);
  const posts = await res.json();
  const extractAPIContents = (json: any) => {
    const { pages } = json.query;

    return Object.keys(pages).map((id) => pages[id].extract);
  };

  return {
    props: {
      locale,
      title,
      data: extractAPIContents(posts),
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
