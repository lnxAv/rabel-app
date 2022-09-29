// eslint-disable-next-line import/no-anonymous-default-export
export default `
body{
display: block;
overflow: hidden;
}

#globalLoader{
    position: fixed;
    z-index: 2147483647;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #181c20;
    display: flex;
    left: 0,
    right: 0;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.loader {
 /* color of spining  */
 width: 50px;
 height: 50px;
 position: relative;
 background:
 linear-gradient(to right, red 4px, transparent 4px) 0 0,
 linear-gradient(to right, red 4px, transparent 4px) 0 100%,
 linear-gradient(to left,red 4px, transparent 4px) 100% 0,
 linear-gradient(to left, red 4px, transparent 4px) 100% 100%,
 linear-gradient(to bottom, red 4px, transparent 4px) 0 0,
 linear-gradient(to bottom, red 4px, transparent 4px) 100% 0,
 linear-gradient(to top, red 4px, transparent 4px) 0 100%,
 linear-gradient(to top, red 4px, transparent 4px) 100% 100%;
 background-repeat: no-repeat;
 background-size: 15px 15px;
 animation: spin 1s infinite;
}
@keyframes spin {
 0% {
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
 }
 100% {
  -webkit-transform: rotate(360deg);
  -ms-transform: rotate(360deg);
  -o-transform: rotate(360deg);
  transform: rotate(360deg);
 }
}`;
