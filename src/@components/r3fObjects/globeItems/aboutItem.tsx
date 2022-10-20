import { MeshProps } from '@react-three/fiber';
import React, { Suspense, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { Model } from './Me_medium';
import { TypeWriting } from '../../htmlObjects/globeEffectHtml';

type Props = {} & MeshProps;

const AboutItem = ({ ...props }: Props) => {
  const string =
    'Hi, I am a young ambitious developer, In my free time I push user interactivity further with WebGL and improve my ukulele skills.';
  useEffect(() => {}, []);
  return (
    <mesh {...props}>
      <Suspense fallback={<Html>XX</Html>}>
        <Model rotation={[0, -1.5, 0]} />
      </Suspense>
      <Html distanceFactor={8} position={[0, -0.6, 0]}>
        <div
          style={{
            display: `${props.visible ? 'flex' : 'none'}`,
            position: 'relative',
            width: '100vw',
            height: 'auto',
            left: '-50vw',
          }}
        >
          <div
            style={{
              position: 'relative',
              fontSize: '32x',
              minWidth: '50vw',
              maxWidth: '700px',
              margin: 'auto',
              padding: '10px 5vw',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                padding: '2px 0',
                top: '-25px',
                fontFamily: 'disket-mono-bold, monospace',
                fontSize: '25px',
              }}
            >
              Pierre
            </div>
            {props.visible ? (
              <TypeWriting
                timedLines={[
                  {
                    text: string,
                    time: string.length * 25,
                  },
                ]}
              />
            ) : null}
            <div style={{ position: 'absolute', bottom: '-5px', right: '25px', opacity: 0.5 }}>
              beta-0.1
            </div>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default AboutItem;
