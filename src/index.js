const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const port = 8080;
app.listen(port, () => {
  console.log(`Frontend rodando em http://localhost:${port}`);
});
