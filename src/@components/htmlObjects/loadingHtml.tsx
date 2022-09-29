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

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  div.head-box {
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
const Type1 = ({ timedLines = [] }: UIProps) => {
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

const LoadingHtml = ({ ...props }: Props) => {
  useEffect(() => {}, []);
  return (
    <BodyBox>
      <div className="head-box">
        <Loading title={props.title} />
      </div>
      <div className="body-box">
        <Type1
          timedLines={[
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001; \n', time: 1000 },
            { text: 'h001 000-xxx-442 hc_001;', time: 1000 },
          ]}
        />
      </div>
    </BodyBox>
  );
};

export default LoadingHtml;
