require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import auth from './auth';

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/*', auth);

app.get('/', (req, res) => {
    res.send('Hello worldddsss!');
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
