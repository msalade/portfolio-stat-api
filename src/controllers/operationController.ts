import { Express } from 'express';

import { IOperationRepository } from '../dataAccess/operationRepository';

const operationController = (
    app: Express,
    operationsRepository: IOperationRepository
) => {
    const basePath = '/operation';

    app.get(`${basePath}/:id`, async (req, res) => {
        const operationId = req.params.id;
        const operation = await operationsRepository.get(operationId);

        res.json(operation);
    });

    app.post(`${basePath}`, async (req, res) => {
        const operationToUpdate = req.body;

        await operationsRepository.update(operationToUpdate);

        res.send('Ok');
    });

    app.put(`${basePath}`, async (req, res) => {
        const newOperation = req.body;

        const operationId = await operationsRepository.create(newOperation);

        res.json({ id: operationId });
    });

    app.delete(`${basePath}/:id`, async (req, res) => {
        const operationId = req.params.id;

        await operationsRepository.remove(operationId);

        res.send('Ok');
    });
};

export default operationController;
