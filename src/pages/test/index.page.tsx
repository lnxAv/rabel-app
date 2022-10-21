import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  BreathingBox,
  CircleText,
  TypeLine,
  TypePill,
  TypePlus,
} from '../../@components/htmlObjects/globeEffectHtml';

import { XPage } from '../x-page';
import R3f from './r3f';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  animation: ${rotate} 5s linear infinite;
  transform-origin: center;
`;

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

const CenteredText = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100vw;
  margin: auto;
`;

type LiveDate = {
  day: string;
  year: number;
  hours: number;
  minute: number;
};

const getLiveDate = (date: Date): LiveDate => ({
  day: date.toLocaleString('en-us', { weekday: 'short' }),
  year: date.getFullYear(),
  hours: date.getHours(),
  minute: date.getMinutes(),
});
const Test: XPage = ({ title }: any) => {
  const date = useRef(new Date());
  const timeInterval = useRef<any>(null);
  const [liveDate, setLiveDate] = useState<LiveDate>(getLiveDate(date.current));
  useEffect(() => {
    timeInterval.current = setInterval(() => {
      date.current.setSeconds(date.current.getSeconds() + 1);
      setLiveDate(getLiveDate(date.current));
    }, 1000);
    return () => {
      clearInterval(timeInterval.current);
    };
  }, []);
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
              display: 'flex',
              flexDirection: 'row',
              fontSize: '15px',
              fontFamily: 'project-space, monospace',
            }}
          >
            <div>
              `{liveDate.day}
              {liveDate.year}|
            </div>
            <div style={{ fontSize: '15px', fontFamily: 'dot16' }}>
              {liveDate.hours}
              <BreathingBox>
                <p>:</p>
              </BreathingBox>
              {liveDate.minute}
            </div>
          </div>
          <div className="navigation">RABL | v0.1</div>
        </Header>
      </Block>
      <Block style={{ position: 'relative', top: 'calc(100vh - 70px)', padding: '0 15px' }}>
        <div>
          <TypePlus size={35} />
          <TypeLine opacity={0.8} size={3} length={50} color="red" />
        </div>
        <Rotate style={{ position: 'absolute', top: '-25px', right: '60px' }}>
          <div style={{ position: 'relative', top: '-58px', right: '0px' }}>
            <CircleText
              text=" | SCROLL | SCROLL | "
              arc={360}
              radius="60px"
              offset={0}
              fontSize={15}
              color="red"
            />
          </div>
        </Rotate>
        <div
          style={{
            content: ' ',
            position: 'absolute',
            top: '-40px',
            right: '50px',
            transform: 'rotate(-45deg)',
            margin: 'auto',
            width: '22px',
            height: '22px',
            borderLeft: '1px solid white',
            borderBottom: '1px solid white',
            opacity: '0.8',
          }}
        />
        <div style={{ borderTop: '1px solid red', padding: '0 17px' }} />
      </Block>
      <Block style={{ top: '180vh' }}>
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
            fontSize: '25px',
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
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            fontSize: '25px',
            maxWidth: '550px',
            fontFamily: 'disket-mono-bold, monospace',
            letterSpacing: '6px',
          }}
        >
          <div>
            <a href="mailto:pierrew.rabel@gmail.com?subject = Feedback">@Email</a>
          </div>
          <div>
            <a href="https://www.linkedin.com/in/pierrewrabel/">$LinkdIn</a>
          </div>
          <div>
            <a href="https://github.com/lnxAv">#Git</a>
          </div>
        </CenteredText>
        <CenteredText
          style={{ fontSize: '14px', maxWidth: '550px', fontFamily: 'dot16, monospace' }}
        >
          <span>
            Thank you for your visit, this site has been created with care and passion. It is my
            first of many projects with Three.js to come; this personal template built on thousands
            of resources can be found <a href="https://github.com/lnxAv/r3f-basic">here</a>.
          </span>
        </CenteredText>
        <CenteredText style={{ fontSize: '12px' }}>- RABL</CenteredText>
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
  damping: 9.5,
  distance: 1,
  scrollR3f: true,
};

Test.withR3f = R3f;

Test.htmlMotion = {};

export default Test;
