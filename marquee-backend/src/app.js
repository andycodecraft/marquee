const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : true;

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','OPTIONS'],
  credentials: true, // we’ll send httpOnly cookie
}));

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
