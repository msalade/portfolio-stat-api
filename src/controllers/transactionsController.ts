import { Express } from 'express';

import { ITransactionRepository } from '../dataAccess/transactionRepository';

const transactionController = (
    app: Express,
    currenciesRepository: ITransactionRepository
) => {
    const basePath = '/transaction';

    app.get(`${basePath}/all/:userEmail?`, async (req, res) => {
        const userEmail = req.params.userEmail;
        const transactions = await currenciesRepository.getAll();
        const filteredTransactions = transactions
            .filter(
                transaction =>
                    !userEmail || transaction.user.email === userEmail
            )
            .sort(
                (a, b) => (new Date(b.date) as any) - (new Date(a.date) as any)
            );

        res.json(filteredTransactions);
    });

    app.get(`${basePath}/:id`, async (req, res) => {
        const transactionId = req.params.id;
        const transaction = await currenciesRepository.get(transactionId);

        res.json(transaction);
    });

    app.post(`${basePath}`, async (req, res) => {
        const transactionToUpdate = req.body;

        await currenciesRepository.update(transactionToUpdate);

        res.send('Ok');
    });

    app.put(`${basePath}`, async (req, res) => {
        const newTransaction = req.body;

        const transactionId = await currenciesRepository.create(newTransaction);

        res.json({ id: transactionId });
    });

    app.delete(`${basePath}/:id`, async (req, res) => {
        const transactionId = req.params.id;

        await currenciesRepository.remove(transactionId);

        res.send('Ok');
    });
};

export default transactionController;
