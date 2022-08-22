import { StoreType } from 'leva/dist/declarations/src/types';

export interface XGUIStoreSlice {
  guiStore?: StoreType | null
  setGUIStore: (guiStore: StoreType | null | undefined) => void
}
