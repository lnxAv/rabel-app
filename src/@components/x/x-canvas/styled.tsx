import { CSSProperties } from 'react';
import styled from 'styled-components';

const XCanvasWrapper = styled.div<{ devMode: boolean }>`
  position: relative;
  width: inherit;
  height: inherit;
  max-width: inherit;
  max-height: inherit;
  button#canvas-toggle {
    position: absolute;
    display: none;
  }
  ${(props) => (props.devMode
    ? `
  border: 1px solid #181c20;
  background: #181c20;
  font-size: 12px;
  font-family: monospace;
  button#canvas-toggle {
    display: inline;
    z-index: 1000;
    background: #181c20;
    padding: 1px 5px;
    border-bottom-right-radius: 5px;
  }
`
    : '')}
`;
export const fullScreenStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
  width: '100vw',
  height: '100vh',
};

export default XCanvasWrapper;
