require('./models/db');
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const { jwtStrategy } = require('./config/passport.config');
const { rateLimiter } = require('./middlewares/rateLimiter');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.router');
const bagsRouter = require('./routes/bags.router.js');
const usersRouter = require('./routes/users.router');
const establishmentsRouter = require('./routes/establishments.router');
const ordersRouter = require('./routes/orders.router');
const User = require('./models/users.model.js')

// Initialize express app
const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Compression Middleware
app.use(compression());

// CORS Middleware
app.use(cors());
app.options('*', cors());

// Passport Middleware
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use('/auth', rateLimiter);

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
// app.use('establishments/bags', bagsRouter);
app.use('/users', usersRouter);
app.use('/establishments', establishmentsRouter, bagsRouter);
app.use('/orders', ordersRouter);

module.exports = app;
