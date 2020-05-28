import firebase from 'firebase';
import baseRepository, { IRepository } from './baseRepository';
import Transaction, {
    TransactionRef,
    TransactionRepo
} from '../dataTypes/transacion';
import app from './firebaseApp';

export type ITransactionRepository = IRepository<
    Transaction,
    TransactionRepo
> & {
    getByEmail: (email: string) => Promise<Transaction[]>;
};

const transactionRepository = (): ITransactionRepository => {
    const operColName = 'operations';
    const userColName = 'users';
    const collectionName = 'transactions';

    const operations = app.firestore().collection(operColName);
    const users = app.firestore().collection(userColName);
    const repo = baseRepository<Transaction, TransactionRepo>(collectionName);

    const getTransactionData = async (transaction: Transaction) => {
        const idDate = !!(transaction.date as any).toDate;

        return {
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
    };

    const getAll = async (): Promise<Transaction[]> => {
        const promTransactions = await repo
            .getAll()
            .then(async transactions => transactions.map(getTransactionData));

        return Promise.all(promTransactions);
    };

    const get = async (id: string): Promise<Transaction> => {
        return repo.get(id).then(getTransactionData);
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
            date: new Date(transacion.date as any),
            buy: (await operations.doc(`${transacion.buy}`).get()).ref,
            sell: (await operations.doc(`${transacion.sell}`).get()).ref,
            user: (await users.doc(`${transacion.user}`).get()).ref
        } as TransactionRepo;

        return repo.update(transacionToUpadte);
    };

    const getByEmail = async (email: string): Promise<Transaction[]> => {
        const transactions = await getAll();
        const filteredTransactions = transactions
            .filter(transaction => !email || transaction.user.email === email)
            .sort(
                (a, b) => (new Date(b.date) as any) - (new Date(a.date) as any)
            );

        return filteredTransactions;
    };

    return {
        ...repo,
        get,
        create,
        update,
        getAll,
        getByEmail
    };
};

export default transactionRepository;
