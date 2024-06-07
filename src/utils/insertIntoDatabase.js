const oracledb = require('oracledb');

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
    res.send.json ({message:'Database copiada com sucesso!'});
  }
}

module.exports = insertIntoDatabase;
