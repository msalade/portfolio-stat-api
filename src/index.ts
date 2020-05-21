require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import auth from './auth';

import userRepository from './dataAccess/userRepository';
import currenciesRepository from './dataAccess/currenciesRepository';
import operationsRepository from './dataAccess/operationsRepository';

import userController from './controllers/userController';
import currencyController from './controllers/currencyController';
import operationsController from './controllers/operationsController';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/*', auth);

userController(app, userRepository());
currencyController(app, currenciesRepository());
operationsController(app, operationsRepository());

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
