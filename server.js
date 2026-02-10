// Server entry point for DirectAdmin Node.js App
// Este archivo inicia Next.js para producción

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// DirectAdmin puede asignar el puerto a través de variables de entorno
const port = parseInt(process.env.PORT || process.env.APP_PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Modo producción
const dev = false;

const app = next({ 
  dev,
  hostname,
  port,
  dir: __dirname 
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      throw err;
    }
    console.log(`> Next.js server ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'production'}`);
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});
