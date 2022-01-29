// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';
 
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/') {
       app.render(req, res, '/', query)
    }
    else 
    if (pathname === '/chat') {
       app.render(req, res, '/chat', query)
    }
    else {
       handle(req, res, parsedUrl)
    }
 
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})