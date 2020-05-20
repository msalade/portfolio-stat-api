require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import auth from './auth';
import userController from './controllers/userController';
import userRepository from './dataAccess/userRepository';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/*', auth);

app.get('/', (req, res) => {
    res.send('Hello worldddsss!');
});

userController(app, userRepository());

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
