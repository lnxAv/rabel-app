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

import { usePoolStore } from '../../../../@helpers/poolStore';

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
  object: ReactElement<PoolItemCreationProps, string | JSXElementConstructor<any>> | null;
  context: ItemContext;
};
type PoolItemReserve = Record<ItemKey, PoolItem>;
type ActiveItemRecord = Record<ItemKey, PoolItem | null>;
type ReservedItemRecord = Record<ItemKey, ItemKey>;
type GetActiveReturnType<Amount> = Amount extends undefined ? PoolItem : Array<PoolItem> | null;

export type PoolItemCreationProps = { context: ItemContext };

export type PoolableComponent = ComponentType<PoolItemCreationProps>;

export const useObjectPool = <P,>(
  poolItemCreation: PoolableComponent | null,
  {
    initialProps,
    reserve = 1,
    activeAtStart = 0,
    limit = reserve + reserve / 2,
  }: ObjectPoolOption<P>
) => {
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const poolIdentity = useRef(Math.random().toString(36).slice(2, 7).toUpperCase());
  const poolItems = useRef<PoolItemReserve>({});
  const reservedItemKey = useRef<ReservedItemRecord>({});
  const activeItemRecord = useRef<ActiveItemRecord>({});
  const numberReserved = useRef<number>(0);
  const numberActive = useRef<number>(0);
  const [action] = usePoolStore((state) => [state.action]);

  // Delete all items from store
  const deleteAllFromStore = useCallback(() => {
    action.deleteFromStore(Object.keys(poolItems.current));
  }, []);
  useEffect(
    () => () => {
      deleteAllFromStore();
    },
    []
  );
  useEffect(() => {}, [activeItemRecord.current]);
  // genereate a unique key with this pool identity
  function generateItemKey(): ItemKey {
    return `${poolIdentity.current}_${Math.random()}_${new Date().getTime()}`;
  }
  // Add item at the end of the object
  function reservedItemPush(itemKey: ItemKey) {
    if (!reservedItemKey.current[itemKey]) {
      reservedItemKey.current[itemKey] = itemKey;
    }
  }

  // Removes the first item and returns that removed item
  function reservedItemShift(): ItemKey | undefined {
    const itemKey = Object.keys(reservedItemKey.current)?.[0] || undefined;
    if (itemKey) {
      delete reservedItemKey.current[itemKey];
    }
    return itemKey;
  }
  // Removes item and add it to the reserved item list (to be reused)
  const recycleItem = useCallback((itemKey: string) => {
    if (activeItemRecord.current?.[itemKey]) {
      numberReserved.current += 1;
      numberActive.current -= 1;
      delete activeItemRecord.current[itemKey];
      reservedItemPush(itemKey);
    }
  }, []);
  // Removes item and leave it open to garbage collection
  const deleteItem = useCallback((itemKey: string) => {
    if (activeItemRecord.current?.[itemKey]) {
      numberActive.current -= 1;
      delete activeItemRecord.current[itemKey];
      delete poolItems.current[itemKey];
      action.deleteFromStore([itemKey]);
    }
  }, []);
  // Update item props stored in the poolStore
  const update = useCallback((itemKey: string, itemProps: P) => {
    if (activeItemRecord.current?.[itemKey]) {
      action.setItemProps(itemKey, itemProps);
    }
  }, []);
  // Create a new item with a pre-defined or re-defined PoolableComponent
  function createPoolItem(
    itemKey: ItemKey,
    poolItemCreatorOverwrite?: PoolableComponent
  ): PoolItem {
    const poolItemCreator = poolItemCreatorOverwrite || poolItemCreation;
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
      object: poolItemCreator
        ? createElement<PoolItemCreationProps>(poolItemCreator, {
            key: itemKey,
            context,
          })
        : null,
      context,
    };
  }
  // Initialize the pool with it's reserve and pre-active item
  function initializePool() {
    const newReserveAmount = Math.max(reserve - activeAtStart, 0);
    numberReserved.current = newReserveAmount;
    const newActiveListAmount = Math.max(Math.min(activeAtStart, limit), 0);
    numberActive.current = newActiveListAmount;
    for (let i = 0; i < newReserveAmount; i++) {
      const newReserveKey = generateItemKey();
      poolItems.current[newReserveKey] = createPoolItem(newReserveKey);
      reservedItemPush(newReserveKey);
      activeItemRecord.current[newReserveKey] = null;
    }

    const startActiveList = [];
    for (let i = 0; i < newActiveListAmount; i++) {
      const newActiveKey = generateItemKey();
      poolItems.current[newActiveKey] = createPoolItem(newActiveKey);
      startActiveList.push(poolItems.current[newActiveKey]);
      activeItemRecord.current[newActiveKey] = poolItems.current[newActiveKey] || null;
    }
    setIsStarting(false);
  }

  useEffect(() => {
    if (isStarting) {
      initializePool();
    }
  }, []);
  // Return an object available or create one depending on limit
  function getObject(amount?: number): GetActiveReturnType<typeof amount> {
    if (amount === 0) {
      // if has no amount
      return null;
    } else if (amount === undefined) {
      // if is undefined
      const reservedKey = reservedItemShift();
      if (reservedKey) {
        numberReserved.current -= 1;
        numberActive.current += 1;
        activeItemRecord.current[reservedKey] = poolItems.current[reservedKey];
        return poolItems.current[reservedKey];
      } else if (
        numberReserved.current <= 0 &&
        numberActive.current + numberReserved.current < limit
      ) {
        const newKey = generateItemKey();
        poolItems.current[newKey] = createPoolItem(newKey);
        numberActive.current += 1;
        activeItemRecord.current[newKey] = poolItems.current[newKey];
        return poolItems.current[newKey];
      }
      return null;
    } else {
      // more then 1 amount
      const oa: Array<PoolItem> = [];
      for (let i = 0; i < amount; i++) {
        const reservedKey = reservedItemShift();
        if (reservedKey) {
          numberReserved.current -= 1;
          numberActive.current += 1;
          activeItemRecord.current[reservedKey] = poolItems.current[reservedKey];
          oa.push(poolItems.current[reservedKey]);
        } else if (
          numberReserved.current <= 0 &&
          numberActive.current + numberReserved.current < limit
        ) {
          const newKey = generateItemKey();
          poolItems.current[newKey] = createPoolItem(newKey);
          numberActive.current += 1;
          activeItemRecord.current[newKey] = poolItems.current[newKey];
          oa.push(poolItems.current[newKey]);
        } else {
          break;
        }
      }
      return oa || null;
    }
  }
  // Add a poolItem with a re-defined PoolableComponent
  function addCustomPoolItem(poolItemCreationOverwrite: PoolableComponent): PoolItem | null {
    if (numberActive.current + numberReserved.current < limit) {
      const newKey = generateItemKey();
      poolItems.current[newKey] = createPoolItem(newKey, poolItemCreationOverwrite);
      numberActive.current += 1;
      activeItemRecord.current[newKey] = poolItems.current[newKey];
      return poolItems.current[newKey];
    }
    return null;
  }
  // Return a map of active items
  const activeMap = useCallback(
    (mapFunc: (poolItem: PoolItem) => any) =>
      Object.values(activeItemRecord.current).map((value) => {
        if (value) {
          return mapFunc(value);
        }
        return null;
      }),
    [activeItemRecord.current]
  );

  return { getObject, addCustomPoolItem, recycle: recycleItem, delete: deleteItem, activeMap };
};
