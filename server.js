const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'acesso123',
  database: 'new',
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

// Substitua 'seu_endereco_ip' pelo endereço IP da sua máquina
const ipAddress = '172.16.31.21';

app.listen(port, ipAddress, () => {
  console.log(`Servidor rodando em http://${ipAddress}:${port}`);
});
