require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import auth from './auth';

import userRepository from './dataAccess/userRepository';
import currenciesRepository from './dataAccess/currenciesRepository';

import userController from './controllers/userController';
import currencyController from './controllers/currencyController';

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

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
