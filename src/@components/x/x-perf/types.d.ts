import { usePerf } from 'r3f-perf';

type Props = {
  id: string
  ignoreDevMode?: boolean
};

export type XPerfStoreSlice = {
  perfData?: ReturnType<typeof usePerf>
  setPerfData: (perfData?: ReturnType<typeof usePerf>) => void
};
