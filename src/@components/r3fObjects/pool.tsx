import {
  ComponentType,
  createElement,
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { usePoolStore } from './poolStore';

type ItemKey = string;
type ItemContext = {
  recycle: () => void;
  update: (itemProps: any) => void;
  delete: () => void;
  key: any;
};
type ObjectPoolOption<P> = {
  initialProps: P extends undefined ? undefined : () => P;
  reserve?: number;
  activeAtStart?: number;
  limit?: number;
};
type PoolItem = {
  key: ItemKey;
  object: ReactElement<PoolItemCreationProps, string | JSXElementConstructor<any>>;
  context: ItemContext;
};
type PoolItemReserve = Record<ItemKey, PoolItem>;
type ActiveItemRecord = Record<ItemKey, boolean>;
type GetActiveReturnType<Amount> = Amount extends undefined ? PoolItem : Array<PoolItem> | null;

export type PoolItemCreationProps = { context: ItemContext };

export type PoolableComponent = ComponentType<PoolItemCreationProps>;

export const useObjectPool = <P,>(
  poolItemCreation: PoolableComponent,
  {
    initialProps,
    reserve = 1,
    activeAtStart = 0,
    limit = reserve + reserve / 2,
  }: ObjectPoolOption<P>
) => {
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const poolId = useRef(Math.random().toString(36).slice(2, 7).toUpperCase());
  const poolItems = useRef<PoolItemReserve>({});
  const reservedItemKey = useRef<Array<ItemKey>>([]);
  const activeItemRecord = useRef<ActiveItemRecord>({});
  const numberReserved = useRef<number>(0);
  const numberActive = useRef<number>(0);
  const [action] = usePoolStore((state) => [state.action]);

  useEffect(
    () => () => {
      action.deleteFromStore(Object.keys(poolItems.current));
    },
    []
  );

  function generateItemKey(): ItemKey {
    return `${poolId.current}_${Math.random()}_${new Date().getTime()}`;
  }

  const recycleItem = useCallback((itemKey: string) => {
    if (activeItemRecord.current?.[itemKey]) {
      numberReserved.current += 1;
      numberActive.current -= 1;
      delete activeItemRecord.current[itemKey];
      reservedItemKey.current.push(itemKey);
    }
  }, []);

  const deleteItem = useCallback((itemKey: string) => {
    if (activeItemRecord.current?.[itemKey]) {
      numberActive.current -= 1;
      delete activeItemRecord.current[itemKey];
      action.deleteFromStore([itemKey]);
    }
  }, []);

  const update = useCallback((itemKey: string, itemProps: P) => {
    if (activeItemRecord.current?.[itemKey]) {
      action.setItemProps(itemKey, itemProps);
    }
  }, []);

  function createPoolItem(itemKey: ItemKey): PoolItem {
    const context: ItemContext = {
      key: itemKey,
      recycle: () => recycleItem(itemKey),
      update: (itemProps) => update(itemKey, itemProps),
      delete: () => deleteItem(itemKey),
    };
    const itemProps = initialProps ? initialProps() : undefined;
    action.createItem(itemKey, {
      context,
      itemProps,
    });
    return {
      key: itemKey,
      object: createElement<PoolItemCreationProps>(poolItemCreation, {
        key: itemKey,
        context,
      }),
      context,
    };
  }

  function startReserve() {
    const newReserveAmount = Math.max(reserve - activeAtStart, 0);
    numberReserved.current = newReserveAmount;
    const newActiveListAmount = Math.max(Math.min(activeAtStart, limit), 0);
    numberActive.current = newActiveListAmount;
    for (let i = 0; i < newReserveAmount; i++) {
      const newReserveKey = generateItemKey();
      poolItems.current[newReserveKey] = createPoolItem(newReserveKey);
      reservedItemKey.current.push(newReserveKey);
      activeItemRecord.current[newReserveKey] = false;
    }

    const startActiveList = [];
    for (let i = 0; i < newActiveListAmount; i++) {
      const newActiveKey = generateItemKey();
      poolItems.current[newActiveKey] = createPoolItem(newActiveKey);
      startActiveList.push(poolItems.current[newActiveKey]);
      activeItemRecord.current[newActiveKey] = true;
    }
    setIsStarting(false);
  }

  useEffect(() => {
    if (isStarting) {
      startReserve();
    }
  }, []);

  function getObject(amount?: number): GetActiveReturnType<typeof amount> {
    if (amount === 0) {
      // if has no amount
      return null;
    } else if (amount === undefined) {
      // if is undefined
      const reservedKey = reservedItemKey.current.shift();
      if (reservedKey) {
        numberReserved.current -= 1;
        numberActive.current += 1;
        activeItemRecord.current[reservedKey] = true;
        return poolItems.current[reservedKey];
      } else if (
        numberReserved.current <= 0 &&
        numberActive.current + numberReserved.current < limit
      ) {
        const newKey = generateItemKey();
        poolItems.current[newKey] = createPoolItem(newKey);
        numberActive.current += 1;
        activeItemRecord.current[newKey] = true;
        return poolItems.current[newKey];
      }
      return null;
    } else {
      // more then 1 amount
      const oa: Array<PoolItem> = [];
      for (let i = 0; i < amount; i++) {
        const reservedKey = reservedItemKey.current.shift();
        if (reservedKey) {
          numberReserved.current -= 1;
          numberActive.current += 1;
          activeItemRecord.current[reservedKey] = true;
          oa.push(poolItems.current[reservedKey]);
        } else if (
          numberReserved.current <= 0 &&
          numberActive.current + numberReserved.current < limit
        ) {
          const newKey = generateItemKey();
          poolItems.current[newKey] = createPoolItem(newKey);
          numberActive.current += 1;
          activeItemRecord.current[newKey] = true;
          oa.push(poolItems.current[newKey]);
        } else {
          break;
        }
      }
      return oa || null;
    }
  }

  function activeMap(mapFunc: (poolItem: PoolItem) => any) {
    return Object.keys(activeItemRecord.current).map((key) => {
      if (activeItemRecord.current[key]) {
        return mapFunc(poolItems.current[key]);
      }
      return null;
    });
  }

  return { getObject, recycle: recycleItem, activeMap };
};
