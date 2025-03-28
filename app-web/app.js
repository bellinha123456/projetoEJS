// Importa os módulos necessários
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

// Configura o express
const App = express();
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "mvc/views"));
App.use(express.static(path.join(__dirname, "publico")));
App.use(express.urlencoded({ extended: true }));
App.use(express.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost", // Seu host
  user: "root", // Seu usuário do MySQL
  password: "", // Sua senha do MySQL
  database: "" // Nome do banco de dados
});

// Verifica a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar com o banco de dados: " + err.stack);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

// Endpoint para a página de login
App.get("/", (req, res) => {
  res.render("index", {
    nome: "Policate",
    texto: "Está em demonstração",
    message: null
  });
});

// Endpoint para processar o login
App.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.render("index", {
      nome: "Policate",
      texto: "Está em demonstração",
      message: "Erro ao preencher o formulário"
    });
  }

  // Consulta no banco de dados para verificar o usuário e a senha
  db.execute("SELECT * FROM users WHERE usuario = ?", [usuario], (err, results) => {
    if (err) {
      return res.status(500).send("Erro no servidor");
    }
    if (results.length > 0) {
      const user = results[0];
      // Verifica se a senha está correta
      if (user.senha === senha) {
        return res.redirect("/conta");
      } else {
        return res.render("index", {
          nome: "Policate",
          texto: "Está em demonstração",
          message: "Senha incorreta"
        });
      }
    } else {
      return res.render("index", {
        nome: "Policate",
        texto: "Está em demonstração",
        message: "Usuário não encontrado"
      });
    }
  });
});

// Endpoint para a página da conta
App.get("/conta", (req, res) => {
  res.render("conta");
});

// Iniciar o servidor
App.listen(3000, () => console.log("Aplicação No Ar"));