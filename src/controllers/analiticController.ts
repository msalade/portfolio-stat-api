import { Express, Request } from 'express';
import { eachMonthOfInterval, isSameMonth, addDays } from 'date-fns';

import { IUserRepository } from '../dataAccess/userRepository';
import { ITransactionRepository } from '../dataAccess/transactionRepository';
import { getUserEmail } from '../auth';
import Transaction from '../dataTypes/transacion';

const cryptocompare = require('cryptocompare');
cryptocompare.setApiKey(process.env.CRYPTOCOMPARE_API_KEY);

const toObject = (keys: string[], values: any[]) => {
    const obj: any = {};

    keys.forEach((key, index) => {
        obj[key] = values[index];
    });

    return obj;
};

const analiticController = (
    app: Express,
    userRepository: IUserRepository,
    transactionRepository: ITransactionRepository
) => {
    const basePath = '/analitic';

    const getTransactions = async (
        req: Request,
        ue?: string
    ): Promise<Transaction[]> => {
        const email = ue || (await getUserEmail(req));
        const transactions = await transactionRepository.getByEmail(email);

        return transactions;
    };

    app.get(`${basePath}/me/firstTrade`, async (req, res) => {
        const transactions = await getTransactions(req);
        const length = (transactions || []).length;
        const firstTrade = length === 0 ? undefined : transactions[length - 1];

        res.json(firstTrade);
    });

    app.get(`${basePath}/me/lastTrade`, async (req, res) => {
        const transactions = await getTransactions(req);
        const lastTrade = (transactions || [])[0];

        res.json(lastTrade);
    });

    app.get(`${basePath}/me/tradesByMont`, async (req, res) => {
        const transactions = await getTransactions(req);
        const length = (transactions || []).length;
        const start = transactions[length - 1]?.date || new Date();
        const end = new Date();

        const months = eachMonthOfInterval({
            start,
            end
        });

        const tradesByMonth = months.map(date => ({
            date: addDays(date, 1),
            number: 0
        }));

        transactions.forEach(transaction => {
            const index = tradesByMonth.findIndex(tr =>
                isSameMonth(transaction.date, tr.date)
            );

            tradesByMonth[index].number += 1;
        });

        res.json(tradesByMonth);
    });

    app.get(`${basePath}/me/currencies/:currency`, async (req, res) => {
        const currency = req.params.currency;
        const yesterday = addDays(new Date(), -1);
        const currencies: {
            [key: string]: {
                raw: number;
                byCurr: number;
                change: number;
            };
        } = {};
        const currenciesHelper: {
            symbol: string;
            isFiat: boolean;
        }[] = [];
        const transactions = await getTransactions(req);

        const addOrCreate = (key: string, value: number, isFiat: boolean) => {
            if (currencies[key]) {
                currencies[key].raw += value;
            } else {
                currenciesHelper.push({
                    symbol: key,
                    isFiat
                });

                currencies[key] = {
                    raw: value,
                    byCurr: 0,
                    change: 0
                };
            }
        };

        transactions?.forEach(transaction => {
            const buy = transaction.buy;
            const sell = transaction.sell;

            addOrCreate(
                buy.currency.symbol,
                buy.ammount,
                buy.currency.type === 'fiat'
            );
            addOrCreate(
                sell.currency.symbol,
                -sell.ammount,
                sell.currency.type === 'fiat'
            );
        });

        const pricesList = await Promise.all(
            currenciesHelper.map(
                async ({ isFiat, symbol }) =>
                    (await cryptocompare.price(symbol, [currency]))[currency]
            )
        );

        const curPriceSymbol = currenciesHelper.map(cur => cur.symbol);

        const prices = toObject(curPriceSymbol, pricesList);

        const histPricesList = await Promise.all(
            currenciesHelper.map(
                async ({ isFiat, symbol }) =>
                    (
                        await cryptocompare.priceHistorical(
                            symbol,
                            [currency],
                            yesterday
                        )
                    )[currency]
            )
        );

        const histPrices = toObject(curPriceSymbol, histPricesList);

        for (let symbol in currencies) {
            currencies[symbol].byCurr = currencies[symbol].raw * prices[symbol];
            currencies[symbol].change =
                100 *
                ((prices[symbol] - histPrices[symbol]) /
                    ((prices[symbol] + histPrices[symbol]) / 2));
        }

        res.json(currencies);
    });
};

export default analiticController;
