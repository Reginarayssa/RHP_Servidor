const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const oracledb = require('oracledb');
const fs = require('fs');
const Papa = require('papaparse');
const xlsx = require('xlsx');
const confige = require('../config/db'); 

router.post('/', upload.single('file'), async (req, res) => {
    let config = confige
    let connection;

    try {
      if (!req.file) {
        return res.status(400).send({message:'Nenhum arquivo foi enviado'});
      }
  
      connection = await oracledb.getConnection(config);
  
      const fileExtension = req.file.originalname.split('.').pop();
      console.log('Extensão do arquivo:', fileExtension);
  
      if (fileExtension === 'csv') {
        console.log('Processando arquivo CSV');
        const file = fs.createReadStream(req.file.path);
        Papa.parse(file, {
          header: true,
          step: async (row) => {
            console.log('Linha do CSV:', row.data);
            await insertIntoDatabase(row.data, connection);
          },
          complete: () => {
            console.log('Parsing completo.');
            fs.unlink(req.file.path, (err) => {
              if (err) console.error('Erro ao excluir o arquivo:', err);
            });
           return res.status(200).json ({message:'Arquivo CSV processado com sucesso!'});
          },
          error: (err) => {
            console.error('Erro no Papa Parse:', err);
            res.status(500).json ({message:'Erro ao processar o arquivo CSV.'});
          }
        });
      } else if (fileExtension === 'xlsx') {
        console.log('Processando arquivo XLSX');
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
  
        for (let row of jsonData) {
          await insertIntoDatabase(row, connection);
        }
        console.log('Parsing completo.');
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Erro ao excluir o arquivo:', err);
        });
        return res.status(200).json ({message:'Arquivo XLSX processado com sucesso!'});
      
      } else {
        res.status(400).json ('Tipo de arquivo não suportado');
      }
    } catch (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      res.status(500).send('Erro ao conectar ao banco de dados.');
    } finally {}
  });
  
  async function insertIntoDatabase(row, connection) {
    const query = `INSERT INTO val_pro (
      CD_TAB_FAT, CD_PRO_FAT, DT_VIGENCIA, VL_HONORARIO, VL_OPERACIONAL, VL_TOTAL, 
      CD_IMPORT, VL_SH, VL_SD, QT_PONTOS, QT_PONTOS_ANEST, SN_ATIVO, 
      NM_USUARIO, DT_ATIVACAO, CD_SEQ_INTEGRA, DT_INTEGRA, 
      CD_IMPORT_SIMPRO, CD_CONTRATO
    ) VALUES (
      :CD_TAB_FAT, :CD_PRO_FAT, :DT_VIGENCIA, :VL_HONORARIO, :VL_OPERACIONAL, 
      :VL_TOTAL, :CD_IMPORT, :VL_SH, :VL_SD, :QT_PONTOS, :QT_PONTOS_ANEST, 
      :SN_ATIVO, :NM_USUARIO, :DT_ATIVACAO, :CD_SEQ_INTEGRA, :DT_INTEGRA, 
      :CD_IMPORT_SIMPRO, :CD_CONTRATO
    )`;  
    
    const bindValues = {
      CD_TAB_FAT: row.CD_TAB_FAT || null,
      CD_PRO_FAT: row.CD_PRO_FAT || null,
      DT_VIGENCIA: row.DT_VIGENCIA ? new Date(row.DT_VIGENCIA) : null,
      VL_HONORARIO: row.VL_HONORARIO || null,
      VL_OPERACIONAL: row.VL_OPERACIONAL || null,
      VL_TOTAL: row.VL_TOTAL || null,
      CD_IMPORT: row.CD_IMPORT || null,
      VL_SH: row.VL_SH || null,
      VL_SD: row.VL_SD || null,
      QT_PONTOS: row.QT_PONTOS || null,
      QT_PONTOS_ANEST: row.QT_PONTOS_ANEST || null,
      SN_ATIVO: row.SN_ATIVO || null,
      NM_USUARIO: row.NM_USUARIO || null,
      DT_ATIVACAO: row.DT_ATIVACAO ? new Date(row.DT_ATIVACAO) : null,
      CD_SEQ_INTEGRA: row.CD_SEQ_INTEGRA || null,
      DT_INTEGRA: row.DT_INTEGRA ? new Date(row.DT_INTEGRA) : null,
      CD_IMPORT_SIMPRO: row.CD_IMPORT_SIMPRO || null,
      CD_CONTRATO: row.CD_CONTRATO || null
    };
  
    try {
      const result = await connection.execute(query, bindValues, { autoCommit: true });
      console.log(`${result.rowsAffected} rows inserted.`);
    } catch (err) {
      console.error('Erro ao inserir no banco de dados:', err);
    }
  }

module.exports = router;