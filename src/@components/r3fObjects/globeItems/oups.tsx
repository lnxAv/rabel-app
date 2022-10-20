import { Html } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';

type OupsText = { text: string; message: string };
const oupsText: Array<OupsText> = [
  {
    text: '🍒',
    message: 'Biological systems produce biological results.\n Messy, unpredictable solutions.',
  },
  {
    text: '🍓',
    message:
      "There's only four things we do better than anyone else;\n music, movies, microcode, high-speed pizza delivery",
  },
  { text: '🍄', message: 'I Think, Sebastian, Therefore I Am.' },
  { text: '🥀', message: 'Probably got him on ice. \n Thaw when needed.' },
  { text: '🍷', message: 'A beginning is a very delicate time.' },
  { text: '🍎', message: 'Memory cannot be defined,\n yet it defines mankind.' },
  { text: '404', message: "Well, what if there is no webpage? \n There wasn't one today." },
];

const Oups = () => {
  const oups = useRef<OupsText>(oupsText[Math.floor(Math.random() * oupsText.length)]);
  useEffect(() => {}, []);
  return (
    <mesh>
      <Html transform sprite>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'red' }}>{oups.current.text}</div>
          <div style={{ fontSize: '5px', whiteSpace: 'pre-line' }}>{oups.current.message}</div>
          <div style={{ position: 'absolute', fontSize: '3px', bottom: -5, right: 0 }}>
            ..in construction
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default Oups;
