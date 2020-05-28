import { Express } from 'express';

import { ITransactionRepository } from '../dataAccess/transactionRepository';
import { getUserEmail } from '../auth';

const transactionController = (
    app: Express,
    transactionsRepository: ITransactionRepository
) => {
    const basePath = '/transaction';

    app.get(`${basePath}/all/me`, async (req, res) => {
        const userEmail = await getUserEmail(req);
        const transactions = (
            await transactionsRepository.getByEmail(userEmail)
        ).sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));

        res.json(transactions);
    });

    app.get(`${basePath}/all/:userEmail?`, async (req, res) => {
        const userEmail = req.params.userEmail;
        const transactions = (
            await transactionsRepository.getByEmail(userEmail)
        ).sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any));

        res.json(transactions);
    });

    app.get(`${basePath}/:id`, async (req, res) => {
        const transactionId = req.params.id;
        const transaction = await transactionsRepository.get(transactionId);

        res.json(transaction);
    });

    app.post(`${basePath}`, async (req, res) => {
        const transactionToUpdate = req.body;

        await transactionsRepository.update(transactionToUpdate);

        res.send('Ok');
    });

    app.put(`${basePath}`, async (req, res) => {
        const newTransaction = req.body;

        const transactionId = await transactionsRepository.create(
            newTransaction
        );

        res.json({ id: transactionId });
    });

    app.delete(`${basePath}/:id`, async (req, res) => {
        const transactionId = req.params.id;

        await transactionsRepository.remove(transactionId);

        res.send('Ok');
    });
};

export default transactionController;
