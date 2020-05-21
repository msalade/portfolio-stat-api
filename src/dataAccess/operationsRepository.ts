import baseRepository, { IRepository } from './baseRepository';
import Operation, { OperationRepo, OperationWithRef } from '../dataTypes/operation';
import app from './firebaseApp';

export type IOperationsRepository = IRepository<Operation, OperationRepo>;

const operationsRepository = (): IOperationsRepository => {
    const currColName = 'currencies';
    const collectionName = 'operations';

    const currencies = app.firestore().collection(currColName);
    const repo = baseRepository<Operation, OperationRepo>(collectionName);

    const get = async (id: string): Promise<Operation> => {
        return repo.get(id).then(async operation => {
            const res = {
                ...operation,
                currency: await (operation.currency as any)
                    .get()
                    .then((curr: any) => ({
                        ...curr.data(),
                        id: curr.id
                    }))
            };

            return res;
        });
    };

    const create = async (operation: OperationWithRef): Promise<string> => {
        const newOperation = {
            ...operation,
            currency: (await currencies.doc(`${operation.currency}`).get()).ref
        } as OperationRepo;

        return repo.create(newOperation);
    };

    const update = async (operation: OperationWithRef): Promise<void> => {
        const operationToUpadte = {
            ...operation,
            currency: (await currencies.doc(`${operation.currency}`).get()).ref
        } as OperationRepo;

        return repo.update(operationToUpadte);
    };

    return {
        ...repo,
        get,
        create,
        update
    };
};

export default operationsRepository;
