import Head from 'next/head';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TypeLine, TypePill, TypePlus } from '../../@components/htmlObjects/globeEffectHtml';

import { XPage } from '../x-page';
import R3f from './r3f';

const Block = styled.div`
  position: absolute;
  width: 100vw;
  scroll-snap-type: y mandatory;
  @media only screen and (max-width: 620px) {
    width: 100vw;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 25px;
  margin: auto;
  width: 95%;
  top: 25px;
  gap: 5%;
  div.extension {
    flex: 1;
    margin-top: 25px;
    border-top: 1px solid red;
    font-size: 25px;
    font-style: bold;
  }
  div.navigation {
    border: 1px solid red;
    width: 150px;
  }
`;

const AboutMeWrapper = styled.div`
  position: relative;
  width: 95%;
  margin: auto;
`;

const AboutMe = styled.div`
  display: flex;
  flex-direction: row;
  width: 90vw;
  max-width: 600px;
  gap: 4%;
  margin: auto;
  div.about-text {
    position: relative;
    width: 48%;
    max-width: 400px;
    border: 1px solid red;
    padding: 15px;
    top: 15px;
    left: 15px;
  }
`;

const Traits = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  row-gap: 5px;
  margin-top: auto;
  margin-bottom: auto;
  div.section {
    display: flex;
    flex-direction: row;
    div {
      width: 100px;
      padding: 3px;
      border: 1px solid red;
      border-right: 0;
    }
    div:last-child {
      border-right: 1px solid red;
    }
  }
`;

const Test: XPage = ({ title }: any) => {
  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Block>
        <Header>
          <div className="extension">xxxxx</div>
          <div className="navigation">xxx | xxx</div>
        </Header>
      </Block>
      <Block style={{ top: 'calc(100vh - 70px)' }}>
        <AboutMeWrapper>
          <div>
            <TypePlus size={35} />
            <TypeLine opacity={0.8} size={3} length={50} color="red" />
          </div>
          <div style={{ borderTop: '1px solid red' }}>
            <div style={{ paddingTop: '7px' }}>about me</div>
            <AboutMe>
              <div className="about-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu dictum lectus, nec
                vulputate metus. Nam a euismod leo, at convallis magna. Vivamus ut enim placerat est
                commodo scelerisque. Curabitur tempus sit amet libero sit amet pharetra. Nam
                vehicula pharetra ullamcorper. Donec eget scelerisque lorem.
              </div>
              <Traits>
                <div className="section">
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                </div>
                <div className="section">
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                </div>
                <div className="section">
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                  <div>
                    <p>Ambitious</p>
                  </div>
                </div>
              </Traits>
            </AboutMe>
          </div>
        </AboutMeWrapper>
      </Block>
      <Block style={{ top: '250vh' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <TypePill rotate={90}>R A B L</TypePill>
          <div style={{ flex: 1, width: '80px' }}>
            <div>Giving life</div>
            <div>to your design</div>
          </div>
        </div>
      </Block>
      <Block style={{ top: '325vh' }}>
        <div
          style={{
            content: ' ',
            transform: 'rotate(135deg)',
            margin: 'auto',
            width: '25vw',
            height: '25vw',
            maxWidth: '75px',
            maxHeight: '75px',
            borderLeft: '5px solid white',
            borderBottom: '5px solid white',
          }}
        />
      </Block>
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

R3f.scrollControls = {
  pages: 4,
  damping: 10,
  scrollR3f: true,
};

Test.withR3f = R3f;

Test.htmlMotion = {};

export default Test;
