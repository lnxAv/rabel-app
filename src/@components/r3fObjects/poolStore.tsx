import { omit } from 'lodash';
import create from 'zustand';

type ItemContext = {
  recycle: () => void;
  update: (itemProps: any) => void;
  delete: () => void;
  key: any;
};
type ItemAspect = {
  context: ItemContext;
  itemProps: any | undefined;
};

type PoolStoreAction = {
  createItem: (key: string, itemAspect: ItemAspect) => void;
  setItemAspect: (key: string, itemAspect: ItemAspect) => void;
  setItemProps: (key: string, itemProps: any) => void;
  deleteFromStore: (keys: Array<string>) => void;
};
type ActionKey = 'action';
const actionKey: ActionKey = 'action';

type PoolStoreBaseType = {
  [key: string]: ItemAspect | undefined;
} & {
  [key in ActionKey]: never;
};

type PoolStoreBaseWithAction<T> = {
  [P in keyof PoolStoreBaseType]: P extends ActionKey ? T : PoolStoreBaseType[P];
};

const isActionKey = (key: string) => key === actionKey;

// Typescript doesn't allow this,
// protect ActionKey from being overwritten and it will work
// @ts-ignore
export const usePoolStore = create<PoolStoreBaseWithAction<PoolStoreAction>>((set, get) => ({
  action: {
    createItem: (key: string, itemAspect: ItemAspect) => {
      let newItem = get()?.[key] || undefined;
      if (!newItem && !isActionKey(key)) {
        newItem = itemAspect;
        set({ [key]: newItem });
      }
    },
    setItemAspect: (key: string, itemAspect: ItemAspect) => {
      let newItem = get()?.[key] || undefined;
      if (newItem && !isActionKey(key)) {
        newItem = itemAspect;
        set({ [key]: newItem });
      }
    },
    setItemProps: (key: string, itemProps: any) => {
      const newItem = get()?.[key] || undefined;
      if (newItem && !isActionKey(key)) {
        newItem.itemProps = itemProps;
        set({ [key]: newItem });
      }
    },
    deleteFromStore: (keys: Array<string>) => {
      if (keys.length && !keys.includes(actionKey)) {
        set((state) => omit(state, keys), true);
      }
    },
  },
}));

export default usePoolStore;
