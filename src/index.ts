require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import auth from './auth';

import userRepository from './dataAccess/userRepository';
import currencyRepository from './dataAccess/currencyRepository';
import operationRepository from './dataAccess/operationRepository';
import transactionRepository from './dataAccess/transactionRepository';

import userController from './controllers/userController';
import currencyController from './controllers/currencyController';
import operationsController from './controllers/operationController';
import transactionsController from './controllers/transactionsController';
import analiticController from './controllers/analiticController';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/*', auth);

userController(app, userRepository());
currencyController(app, currencyRepository());
operationsController(app, operationRepository());
transactionsController(app, transactionRepository());
analiticController(app, transactionRepository());

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
