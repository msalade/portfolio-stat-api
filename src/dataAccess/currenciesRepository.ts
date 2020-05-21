import baseRepository, { IRepository } from './baseRepository';
import Currency from '../dataTypes/currency';

export type ICurrenciesRepository = IRepository<Currency, Currency>;

const currenciesRepository = (): ICurrenciesRepository => {
    const collectionName = 'currencies';
    const repo = baseRepository<Currency, Currency>(collectionName);

    return repo;
};

export default currenciesRepository;