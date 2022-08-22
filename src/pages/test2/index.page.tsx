import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

import { useGlobalStore } from '../../@helpers/x-store';
import globalVariants from '../../@styles/motion.variants';
import { XPage } from '../x-page';
import R3f from './r3f';

const Div = styled.div`
  padding: 25px;
  padding-top: 50px;
  width: 50vw;
  height: auto;
  overflow-y: auto;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Test2: XPage = ({ title, ...props }: any) => {
  const [router] = useGlobalStore((state) => [state.router]);

  return (
    <>
      <Div>
        <h1>{title}</h1>

        {props.data?.map((content: any, i: number) => (
          <motion.div
            {...globalVariants.magicText}
            key={i}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ))}
      </Div>
      <Div>
        <div>
          Etiam ultricies lorem vel nisi luctus posuere. Phasellus ac tincidunt
          purus, non vehicula turpis.
        </div>
        <div>
          <a
            href="/test"
            style={{ color: 'white' }}
            onClick={(e) => {
              e.preventDefault();
              router?.push('/test');
            }}
          >
            {'< test />'}
          </a>
          <br />
          <a
            href={`${props.locale}/test`}
            onClick={(e) => {
              e.preventDefault();
              router?.push('/test2', '/test2', {
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

export async function getServerSideProps({ locale }: any) {
  const title = locale === 'en' ? 'Tetrahedron' : 'Tétraèdre';
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

Test2.htmlMotion = {
  initial: {
    opacity: 0,
    y: -1,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.5,
  },
  exit: {
    opacity: 0,
    y: -5,
  },
};

Test2.R3f = R3f;

export default Test2;
