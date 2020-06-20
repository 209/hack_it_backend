import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import indexRouter from './routes/index.mjs';
import apiRouter from './routes/api.mjs';
import ProcessClass from './vendor/PullentiJavascript/process.js';

ProcessClass.init();

const MongoStore = connectMongo(session);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

export default app;
