import { Express } from 'express';

import { ICurrencyRepository } from '../dataAccess/currencyRepository';

const currencyController = (
    app: Express,
    currenciesRepository: ICurrencyRepository
) => {
    const basePath = '/currency';

    app.get(`${basePath}/all`, async (req, res) => {
        const currencies = await currenciesRepository.getAll();

        res.json(currencies);
    });


    app.get(`${basePath}/:id`, async (req, res) => {
        const currencyId = req.params.id;
        const currency = await currenciesRepository.get(currencyId);

        res.json(currency);
    });

    app.post(`${basePath}`, async (req, res) => {
        const currencyToUpdate = req.body;

        await currenciesRepository.update(currencyToUpdate);

        res.send('Ok');
    });

    app.put(`${basePath}`, async (req, res) => {
        const newCurrency = req.body;

        const currencyId = await currenciesRepository.create(newCurrency);

        res.json({ id: currencyId });
    });

    app.delete(`${basePath}/:id`, async (req, res) => {
        const currencyId = req.params.id;

        await currenciesRepository.remove(currencyId);

        res.send('Ok');
    });
};

export default currencyController;
