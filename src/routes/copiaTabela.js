const express = require('express');
const router = express.Router();
const oracledb = require('oracledb'); 
const confige = require('../config/db'); 


let dbConfig = {
  ...confige, 
};


router.post('/copiaTabela', async (req, res) => {
  console.log('Iniciando rota /copiaTabela...');
  try {
    const { valor1, valor2 } = req.body; 

    if (!valor1 || !valor2) {
      console.log('Campos requeridos faltando');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Tentando conectar ao banco de dados...');
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Conexão estabelecida com sucesso');
    const result = await connection.execute(
      `BEGIN COPIA_TABELA(:valor1, :valor2); END;`,
      {
        valor1: valor1,
        valor2: valor2
      }
    );

    console.log('Procedure executada com sucesso', result);
    res.send('Clonagem bem sucedida!');
    console.log('Tentando commitar a transação...');

    console.log('Fechando a conexão...');
    await connection.close();
    console.log('Conexão fechada');

    res.status(200).json({ message: 'Procedure executada com sucesso!' });
  } catch (error) {
    console.error('Erro ao executar a procedure:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

module.exports = router;
