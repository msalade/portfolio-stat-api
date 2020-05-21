import app from './firebaseApp';

export interface IRepository<T, R> {
    get: (id: string) => Promise<T>;
    getAll: () => Promise<T[]>;
    update: (toUpdate: R) => Promise<void>;
    create: (toCreate: R) => Promise<string>;
    remove: (id: string) => Promise<void>;
    collection: firebase.firestore.CollectionReference<
        firebase.firestore.DocumentData
    >;
}

const baseRepository = <T, R>(collectionName: string): IRepository<T, R> => {
    const collection = app.firestore().collection(collectionName);

    const get = async (id: string) => {
        const result = (await collection.doc(id).get()).data();

        return {
            ...result,
            id
        } as any;
    };

    const getAll = async (): Promise<T[]> => {
        const data = await collection.get();

        return data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as any;
    };

    const update = async (toUpdate: R): Promise<void> => {
        const id = (toUpdate as any).id;

        delete (toUpdate as any).id;

        return collection.doc(id).set(toUpdate);
    };

    const create = async (toCreate: R): Promise<string> => {
        const data = await collection.add(toCreate);

        return data.id;
    };

    const remove = async (id: string): Promise<void> => {
        return collection.doc(id).delete();
    };

    return {
        get,
        getAll,
        update,
        create,
        remove,
        collection
    };
};

export default baseRepository;
