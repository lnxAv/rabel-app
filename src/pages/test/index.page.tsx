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
  padding: 0 15px;
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
    position: relative;
    border: 1px solid red;
    width: 75px;
    left: -1%;
  }
`;

const AboutMeWrapper = styled.div`
  position: relative;
  width: 95%;
  padding: 0 15px;
`;

const Traits = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 5px;
  margin: auto;
  div.section {
    display: flex;
    flex-direction: row;
    width: 100%;
    div {
      width: 100%;
      min-width: 50px;
      padding: 5px;
      border: 1px solid red;
      border-right: 0;
    }
    div:last-child {
      border-right: 1px solid red;
    }
  }
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
  @media (max-width: 700px) {
    flex-direction: column;
    div.about-text {
      width: 95%;
      max-width: none;
    }
    ${Traits} {
      width: 95%;
      padding-top: 50px;
    }
  }
`;

const CenteredText = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100vw;
  margin: auto;
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
          <div
            className="extension"
            style={{
              fontSize: '15px',
              fontFamily: 'project-space, monospace',
            }}
          >
            12:15 p.m
          </div>
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
        <CenteredText
          style={{
            position: 'relative',
            fontFamily: 'project-space, monospace',
            top: '-50px',
          }}
        >
          [ CONSOLE ]
        </CenteredText>
        <div
          style={{
            content: ' ',
            transform: 'rotate(135deg)',
            margin: 'auto',
            width: '25vw',
            height: '25vw',
            maxWidth: '75px',
            maxHeight: '75px',
            borderLeft: '4px solid white',
            borderBottom: '4px solid white',
          }}
        />
        <CenteredText
          style={{
            fontSize: '50px',
            fontFamily: 'project-space, monospace',
          }}
        >
          <p
            style={{
              transform: 'scale(1, 1)',
              letterSpacing: '1px',
            }}
          >
            CONTACT
          </p>
        </CenteredText>
        <CenteredText
          style={{
            fontSize: '25px',
            maxWidth: '550px',
            fontFamily: 'disket-mono-bold, monospace',
            letterSpacing: '6px',
          }}
        >
          @Email $LinkdIn #Git
        </CenteredText>
        <CenteredText
          style={{ fontSize: '14px', maxWidth: '550px', fontFamily: 'dot16, monospace' }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent semper nisl elit, in
          aliquet mi rutrum nec. Donec orci ipsum, faucibus sed maximus in, ultrices vel felis.{' '}
        </CenteredText>
        <CenteredText style={{ fontSize: '12px' }}>XXXX™</CenteredText>
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
  damping: 5,
  distance: 3,
  scrollR3f: true,
};

Test.withR3f = R3f;

Test.htmlMotion = {};

export default Test;
