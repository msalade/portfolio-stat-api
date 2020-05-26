import firebase from 'firebase';
import baseRepository, { IRepository } from './baseRepository';
import Transaction, {
    TransactionRef,
    TransactionRepo
} from '../dataTypes/transacion';
import app from './firebaseApp';

export type ITransactionRepository = IRepository<Transaction, TransactionRepo>;

const transactionRepository = (): ITransactionRepository => {
    const operColName = 'operations';
    const userColName = 'users';
    const collectionName = 'transactions';

    const operations = app.firestore().collection(operColName);
    const users = app.firestore().collection(userColName);
    const repo = baseRepository<Transaction, TransactionRepo>(collectionName);

    const getAll = async (): Promise<Transaction[]> => {
        const promTransactions = await repo.getAll().then(async transactions =>
            transactions.map(async transaction => ({
                ...transaction,
                date: (transaction.date as any).toDate(),
                buy: await (transaction.buy as any)
                    .get()
                    .then(async (oper: any) => {
                        const operation = oper.data();

                        return {
                            ...operation,
                            currency: await operation.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: oper.id
                        };
                    }),
                sell: await (transaction.sell as any)
                    .get()
                    .then(async (oper: any) => {
                        const operation = oper.data();

                        return {
                            ...operation,
                            currency: await operation.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: oper.id
                        };
                    }),
                user: await (transaction.user as any)
                    .get()
                    .then(async (user: any) => {
                        const userData = user.data();

                        return {
                            ...userData,
                            currency: await userData.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: user.id
                        };
                    })
            }))
        );

        return Promise.all(promTransactions);
    };

    const get = async (id: string): Promise<Transaction> => {
        return repo.get(id).then(async transaction => {
            const idDate = !!(transaction.date as any).toDate;

            const res = {
                ...transaction,
                date: idDate
                    ? (transaction.date as any).toDate()
                    : transaction.date,
                buy: await (transaction.buy as any)
                    .get()
                    .then(async (oper: any) => {
                        const operation = oper.data();

                        return {
                            ...operation,
                            currency: await operation.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: oper.id
                        };
                    }),
                sell: await (transaction.sell as any)
                    .get()
                    .then(async (oper: any) => {
                        const operation = oper.data();

                        return {
                            ...operation,
                            currency: await operation.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: oper.id
                        };
                    }),
                user: await (transaction.user as any)
                    .get()
                    .then(async (user: any) => {
                        const userData = user.data();

                        return {
                            ...userData,
                            currency: await userData.currency
                                .get()
                                .then((cur: any) => ({
                                    ...cur.data(),
                                    id: cur.id
                                })),
                            id: user.id
                        };
                    })
            };

            return res;
        });
    };

    const create = async (transacion: TransactionRef): Promise<string> => {
        const newTransaction = {
            ...transacion,
            date: firebase.firestore.Timestamp.fromDate(
                new Date(transacion.date)
            ) as any,
            buy: (await operations.doc(`${transacion.buy}`).get()).ref,
            sell: (await operations.doc(`${transacion.sell}`).get()).ref,
            user: (await users.doc(`${transacion.user}`).get()).ref
        } as TransactionRepo;

        return repo.create(newTransaction);
    };

    const update = async (transacion: TransactionRef): Promise<void> => {
        const transacionToUpadte = {
            ...transacion,
            buy: (await operations.doc(`${transacion.buy}`).get()).ref,
            sell: (await operations.doc(`${transacion.sell}`).get()).ref,
            user: (await users.doc(`${transacion.user}`).get()).ref
        } as TransactionRepo;

        return repo.update(transacionToUpadte);
    };

    return {
        ...repo,
        get,
        create,
        update,
        getAll
    };
};

export default transactionRepository;
