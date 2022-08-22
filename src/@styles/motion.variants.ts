import { Variants } from 'framer-motion';

type GlobalVariants = {
  [key: string]: Variants
};

const globalVariants: GlobalVariants = {
  default: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.1,
        delayChildren: 0.3,
        staggerChildren: 0.1,
        opacity: { duration: 0.7 },
        default: { ease: 'ease-in' },
      },
    },
    exit: {
      opacity: 0,
    },
  },
  defaultScene: {
    initial: {
      x: -15,
    },
    animate: {
      x: 0,
      transition: {
        delay: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1,
        duration: 1,
        default: { ease: 'linear' },
      },
    },
    exit: {
      x: 15,
    },
  },
  magicText: {
    initial: {
      opacity: 0,
      height: 0,
      overflow: 'hidden',
    },
    animate: {
      opacity: 1,
      height: 'auto',
      transition: {
        delay: 0.1,
        delayChildren: 0.3,
        staggerChildren: 0.1,
        opacity: { duration: 0.7 },
        default: { ease: 'linear' },
      },
    },
    exit: {
      opacity: 0,
    },
  },
};

export default globalVariants;
