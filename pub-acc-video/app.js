const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const checkSign  = require('./middlewares/checkSign');
const checkAccessToken = require('./middlewares/checkAccessToken');
const createMenu = require('./middlewares/createMenus');
// const logger = require('koa-logger')

const route = require('./routes/index')

// error handler
onerror(app)

app.use(async (ctx,next) => {
  await next();
  ctx.set('x-Powered-By','koa2');
})
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(checkSign());
app.use(checkAccessToken());
// app.use(createMenu());

// routes
app.use(route.routes())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(81);

module.exports = app
