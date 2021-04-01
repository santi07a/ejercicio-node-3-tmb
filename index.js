require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const morgan = require("morgan");
const fetch = require("node-fetch");

const getLinea = () => {
  const a = fetch(process.env.TMB_API_LINEAS)
    .then(resp => resp.json())
    .then(datos => datos.features.map(linea => ({
      id: linea.properties.CODI_LINIA,
      linea: linea.properties.NOM_LINIA,
      descripcion: linea.properties.DESC_LINIA
    })));
  return console.log(a);
};

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.argv);
const options = program.opts();

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  console.log("Puerto Tomado");
});

app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/metro/lineas", (req, res, next) => {
  res.json(getLinea());
});
