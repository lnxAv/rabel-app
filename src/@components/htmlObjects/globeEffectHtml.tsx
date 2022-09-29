import React, { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TypewriterComponent from 'typewriter-effect';

type Props = { title: string; children?: React.ReactNode };
type TimedLines = Array<{ text: string; time: number }>;
type UIProps = {
  timedLines: TimedLines;
};

const naturalDelay = 350;

const openingAnimationBody = keyframes`
 0% { height: 0; width: 0; }
 100% { height: 100px; width: 200px;}
`;

const openingAnimationHead = keyframes`
 0% { width: 0;}
 100% { width: 200px;}
`;

const breathingText = keyframes`
 0% { opacity: 0.1;}
 50% { opacity: 0.8;}
 100% {opacity: 0.1;}
`;
const breathingTextRotate = keyframes`
 0% { opacity: 0.1;transform: rotate(0deg);}
 50% { opacity: 0.8;}
 100% {opacity: 0.1; transform: rotate(180deg)}
`;

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  div.head-box {
    display: none;
  }
  &.windowed {
    div.head-box {
      display: flex;
      border: 1px solid red;
      overflow: hidden;
      padding: 2px;
      border-bottom: 0;
      width: 200px;
      z-index: 0;
      animation: ${openingAnimationHead} ${naturalDelay}ms linear 1;
    }
    div.body-box {
      border: 1px solid red;
      overflow: hidden;

      padding: 5px;
      height: 90px;
      animation: ${openingAnimationBody} ${naturalDelay}ms linear 1;
    }
  }
`;

const WritingBox = styled.div`
  max-height: 75px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: hidden;
  &.hide {
    span.Typewriter__cursor {
      display: none;
      visibility: hidden;
    }
  }
`;

const BreathingBox = styled.div`
  display: inline-block;
  padding: 0;
  height: auto;
  width: auto;
  p {
    animation: ${breathingText} 1.5s ease-in infinite;
  }
  &.rotate {
    p {
      animation: ${breathingTextRotate} 1.5s ease-in infinite;
    }
  }
`;

const ShapeBox = styled.div`
  div.circle {
    border-radius: 35px;
    border: 1px solid red;
    width: auto;
    height: auto;
    content: ' ';
  }
  div.square {
    border: 1px solid red;
    width: auto;
    height: auto;
    content: ' ';
  }
`;

const Loading = ({ title }: { title: string }) => (
  <p style={{ display: 'flex' }}>
    {' '}
    {title}
    <span>
      <TypewriterComponent
        options={{ loop: true, delay: naturalDelay, deleteSpeed: naturalDelay, cursor: '' }}
        onInit={(typewriter) => {
          typewriter.typeString('...').start();
        }}
      />
    </span>
  </p>
);
export const TypeWriting = ({ timedLines = [] }: UIProps) => {
  const [toggleCursor, setToggleCursor] = useState(false);

  const ok = useCallback(() => setToggleCursor(true), []);
  return (
    <WritingBox className={toggleCursor ? 'hide' : ''}>
      <TypewriterComponent
        options={{
          loop: false,
          delay: naturalDelay,
          cursor: '&block;',
          cursorClassName: 'Typewriter__cursor',
        }}
        onInit={(typewriter) => {
          timedLines.forEach((v) => {
            typewriter
              .changeDelay(Math.max(v.time / v.text.length, 1))
              .typeString(v.text)
              .start();
          });
          typewriter
            .pauseFor(naturalDelay)
            .callFunction(() => {
              ok();
            })
            .start();
        }}
      />
    </WritingBox>
  );
};

export const TypePlus = ({ size, rotate }: { size: number; rotate?: boolean }) => (
  <BreathingBox className={`${rotate ? 'rotate' : ''}`}>
    <p style={{ fontSize: `${size}px`, color: 'red' }}>+</p>
  </BreathingBox>
);

export const TypeDots = ({ size }: { size: number }) => (
  <ShapeBox>
    <div className="circle" style={{ width: `${size}px`, height: `${size}px` }} />
  </ShapeBox>
);

export const TypeMultipleDots = ({ size }: { size: number }) => (
  <ShapeBox
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
    <div className="circle" style={{ width: '28%', height: '28%', margin: '2%' }} />
  </ShapeBox>
);

export const TypeSquareDots = ({ size }: { size: number }) => (
  <ShapeBox
    style={{
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <div className="circle" style={{ width: '30%', height: '30%', margin: '10%' }} />
    <div className="circle" style={{ width: '30%', height: '30%', margin: '10%' }} />
    <div className="square" style={{ width: '100%', height: '100%' }} />
  </ShapeBox>
);

const GlobeEffectHtml = ({ ...props }: Props) => {
  useEffect(() => {}, []);
  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const getRandomComponent = () => {
    const select = randomNumber(1, 2);
    switch (select) {
      case 1:
        return <TypeDots size={8} />;
      case 2:
        return <TypePlus size={15} rotate={!!randomNumber(0, 1)} />;
      default:
        return null;
    }
  };

  return (
    <BodyBox className="">
      <div className="head-box">
        <Loading title={props.title} />
      </div>
      <div className="body-box">{getRandomComponent()}</div>
    </BodyBox>
  );
};

export default GlobeEffectHtml;
