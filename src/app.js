const express = require('express');
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const tabelaRouter = require('./routes/copiaTabela');


const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.post('/copiaTabela', tabelaRouter);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});


