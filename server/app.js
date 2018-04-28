const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const proxy=require('http-proxy-middleware')
const axios=require('axios')

const indexRouter = require('./routes/index');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/', indexRouter);

// app.use('/test',(req,res)=>{
//   console.log('here')
//   axios.get('http://116.62.233.28:5011/root/gateway.action?command=login&userName=admin&password=8df63d1f54b38da0e10db1e3de95be63')
//   .then(response=>{
//     console.log(response.data)
//     res.json(response.data)
//   })
// })

app.use('/root',proxy({
  target:'http://116.62.233.28:5011',
  changeOrigin:true
}))

// app.use()
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('err',err)
  res.json({err})
});

module.exports = app;
