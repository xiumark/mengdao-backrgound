
/**
 * 本模块应该是没有用到的，待确认
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const proxy=require('http-proxy-middleware')
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/', indexRouter);
app.use('/root',proxy({
  // target:'http://47.110.255.12:5857',   //三国
  target:'http://47.110.255.12:2821',   //城堡
  changeOrigin:true
}))
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log('err',err)
  res.json({err})
});

module.exports = app;
