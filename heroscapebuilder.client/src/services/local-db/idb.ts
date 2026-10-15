/**
 * Minimal promise wrapper over IndexedDB. The object stores use the same names and column names as the
 * server's user tables, so rows can be shipped to the database as they are when a visitor registers.
 */
export const LOCAL_USER_ID = 'local';

export const DATA_STORES = [
    'user_cards',
    'user_terrain',
    'armybuilder',
    'armybuilder_unit',
    'armybuilder_journal',
    'army_game',
    'army_game_unit',
] as const;

export type DataStore = typeof DATA_STORES[number];
/** Browser-only bookkeeping (not a database table): remembers that this browser's owner has an account. */
export type StoreName = DataStore | 'local_meta';

const DB_NAME = 'HeroscapeBuilderLocal';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export const isIndexedDbAvailable = (): boolean => {
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    } catch {
        return false;
    }
};

const createSchema = (db: IDBDatabase) => {
    const userCards = db.createObjectStore('user_cards', { keyPath: 'id', autoIncrement: true });
    userCards.createIndex('OwnedArmyCard', 'OwnedArmyCard');

    const terrain = db.createObjectStore('user_terrain', { keyPath: 'id', autoIncrement: true });
    terrain.createIndex('UQ_user_terrain_user_type_size', ['user_id', 'terrain_type_id', 'terrain_size_id'], { unique: true });

    const army = db.createObjectStore('armybuilder', { keyPath: 'id', autoIncrement: true });
    army.createIndex('UX_armybuilder_ShareId', 'ShareId', { unique: true });
    army.createIndex('ParentArmyBuilderId', 'ParentArmyBuilderId');

    const unit = db.createObjectStore('armybuilder_unit', { keyPath: 'id', autoIncrement: true });
    unit.createIndex('UX_armybuilder_unit_ArmyBuilder_ArmyCard', ['ArmyBuilderId', 'ArmyCardId'], { unique: true });
    unit.createIndex('ArmyBuilderId', 'ArmyBuilderId');

    const journal = db.createObjectStore('armybuilder_journal', { keyPath: 'id', autoIncrement: true });
    journal.createIndex('ArmyBuilderId', 'ArmyBuilderId');

    const game = db.createObjectStore('army_game', { keyPath: 'id', autoIncrement: true });
    game.createIndex('ArmyBuilderId', 'ArmyBuilderId');

    const gameUnit = db.createObjectStore('army_game_unit', { keyPath: 'id', autoIncrement: true });
    gameUnit.createIndex('ArmyGameId', 'ArmyGameId');

    db.createObjectStore('local_meta', { keyPath: 'key' });
};

export const openDb = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            if (!isIndexedDbAvailable()) {
                reject(new Error('Browser storage is not available.'));
                return;
            }
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => createSchema(request.result);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject(new Error('Browser storage is blocked by another tab.'));
        });
        dbPromise.catch(() => { dbPromise = null; });
    }
    return dbPromise;
};

const run = async <T>(
    stores: StoreName | StoreName[],
    mode: IDBTransactionMode,
    work: (tx: IDBTransaction) => IDBRequest<T> | null,
): Promise<T> => {
    const db = await openDb();
    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(stores, mode);
        const request = work(tx);
        let result: T | undefined;
        if (request) request.onsuccess = () => { result = request.result; };
        tx.oncomplete = () => resolve(result as T);
        tx.onerror = () => reject(tx.error ?? request?.error);
        tx.onabort = () => reject(tx.error ?? new Error('Browser storage transaction aborted.'));
    });
};

export const dbGetAll = <T>(store: StoreName): Promise<T[]> =>
    run<T[]>(store, 'readonly', tx => tx.objectStore(store).getAll() as IDBRequest<T[]>);

export const dbGetByIndex = <T>(store: StoreName, index: string, key: IDBValidKey): Promise<T[]> =>
    run<T[]>(store, 'readonly', tx => tx.objectStore(store).index(index).getAll(key) as IDBRequest<T[]>);

export const dbGet = <T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> =>
    run<T | undefined>(store, 'readonly', tx => tx.objectStore(store).get(key) as IDBRequest<T | undefined>);

export const dbCount = (store: StoreName): Promise<number> =>
    run<number>(store, 'readonly', tx => tx.objectStore(store).count());

/** Inserts (or replaces, when the row has an id) and returns the row's key. */
export const dbPut = (store: StoreName, value: object): Promise<number> =>
    run<IDBValidKey>(store, 'readwrite', tx => tx.objectStore(store).put(value)).then(key => key as number);

export const dbDelete = (store: StoreName, key: IDBValidKey): Promise<void> =>
    run<undefined>(store, 'readwrite', tx => tx.objectStore(store).delete(key)).then(() => undefined);

export type BulkOp =
    | { store: StoreName; put: object }
    | { store: StoreName; delete: IDBValidKey };

/** Applies several writes in one transaction: all of them land or none do. */
export const dbBulk = async (ops: BulkOp[]): Promise<void> => {
    if (ops.length === 0) return;
    const stores = Array.from(new Set(ops.map(op => op.store)));
    await run<undefined>(stores, 'readwrite', tx => {
        for (const op of ops) {
            const store = tx.objectStore(op.store);
            if ('put' in op) store.put(op.put); else store.delete(op.delete);
        }
        return null;
    });
};

export const dbClear = (stores: StoreName[]): Promise<void> =>
    run<undefined>(stores, 'readwrite', tx => {
        stores.forEach(store => tx.objectStore(store).clear());
        return null;
    }).then(() => undefined);
