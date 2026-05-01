const fs = require('fs');
const path = require('path');

function resolveSwaggerPath() {
  const swaggerPath = path.resolve(__dirname, '../../docs/swagger.yaml');
  const openapiPath = path.resolve(__dirname, '../../docs/openapi.yaml');

  return fs.existsSync(swaggerPath) ? swaggerPath : openapiPath;
}

module.exports = { resolveSwaggerPath };
