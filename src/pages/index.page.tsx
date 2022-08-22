import { useRouter } from 'next/router';

function RedirectPage() {
  const router = useRouter();
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/test');
  }
}

export default RedirectPage;
/*
import { XPage } from './type'

const Index: XPage = (props: any) => {

  return (
    <>
      hello world
    </>
  )
}

Index.htmlMotion = {
}

Index.r3f = (props: any) => {
  return (
    <>
    {
      //return a scene
    }
    </>
  )
}

Index.r3fMotion = {
}

Index.scrollControls = {
}

export default Index
*/
