const { app } = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Swagger UI disponivel em http://localhost:${port}/docs`);
});
