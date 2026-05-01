const fs = require('fs');
const express = require('express');
const { resolveSwaggerPath } = require('../utils/swagger');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/docs');
});

router.get('/docs', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lista de Tarefas API - Swagger</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/docs/swagger.yaml',
          dom_id: '#swagger-ui',
          deepLinking: true,
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>`);
});

router.get('/docs/swagger.yaml', (req, res) => {
  const swaggerPath = resolveSwaggerPath();
  res.type('text/yaml').send(fs.readFileSync(swaggerPath, 'utf8'));
});

module.exports = router;
