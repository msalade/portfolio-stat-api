import baseRepository, { IRepository } from './baseRepository';
import Currency from '../dataTypes/currency';

export type ICurrencyRepository = IRepository<Currency, Currency>;

const currencyRepository = (): ICurrencyRepository => {
    const collectionName = 'currencies';
    const repo = baseRepository<Currency, Currency>(collectionName);

    return repo;
};

export default currencyRepository;