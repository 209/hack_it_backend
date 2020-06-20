import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import indexRouter from './routes/index.mjs';
import apiRouter from './routes/api.mjs';
import ProcessClass from './vendor/PullentiJavascript/process.js';
import Watch from './tasks/Watch.mjs';

const watch = new Watch();
watch.init();

ProcessClass.init();

const MongoStore = connectMongo(session);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


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
