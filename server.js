const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://appescolas.netfily.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const connection = mysql.createConnection({
  host: 'roundhouse.proxy.rlwy.net',
  user: 'root',
  password: 'b2ChHH5-c6GHdDh3HhaD464E1Db2G2Eh',
  database: 'new',
  port: '26841'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});

app.get('/', (req, res) => {
  res.send('Bem-vindo à API de Avaliação da Educação Básica!');
});

app.get('/escolas', (req, res) => {
  const { ano, idEscola, nomeEscola, tipoRede } = req.query;

  let sql = 'SELECT * FROM escola WHERE 1';

  const conditions = [];

  if (ano) {
    conditions.push(`ano = ${mysql.escape(ano)}`);
  }

  if (idEscola) {
    conditions.push(`id_escola = ${mysql.escape(idEscola)}`);
  }

  if (nomeEscola) {
    conditions.push(`nome_escola LIKE ${mysql.escape(`%${nomeEscola}%`)}`);
  }

  if (tipoRede) {
    conditions.push(`tipo_rede = ${mysql.escape(tipoRede)}`);
  }

  if (conditions.length > 0) {
    sql += ` AND ${conditions.join(' AND ')}`;
  }

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro ao buscar as informações da tabela escola.' });
    } else {
      res.json(results);
    }
  });
});

// Use 0.0.0.0 to listen on all available network interfaces
const ipAddress = '0.0.0.0';

app.listen(port, ipAddress, () => {
  console.log(`Servidor rodando em http://${ipAddress}:${port}`);
});
