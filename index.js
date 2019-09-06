const express = require("express");
const path = require("path");

const convert = require("./lib/convert");
const apiBCB = require("./lib/api-bcb");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const cotacao = await apiBCB.getCotacao();
  res.render("home", { cotacao });
});

app.get("/cotacao", (req, res) => {
  const { cot, qtd } = req.query;
  if (cot && qtd) {
    const conversao = convert.convert(cot, qtd);
    res.render("cotacao", {
      error: false,
      cotacao: convert.toMoney(cot),
      quantidade: convert.toMoney(qtd),
      conversao: convert.toMoney(conversao)
    });
  } else
    res.render("cotacao", {
      error: "Valores Inválidos."
    });
});

app.listen(port, err => {
  if (err) console.log("Servidor não inicializado");
  else console.log(`ConverMyMoney está online na porta: ${port}`);
});
