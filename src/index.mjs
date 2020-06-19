import express from 'express';
import logger from 'morgan';
import indexRouter from './routes/index.mjs';
import apiRouter from './routes/api.mjs';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/api', apiRouter);

export default app;
