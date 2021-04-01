require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const morgan = require("morgan");
const fetch = require("node-fetch");
const debug = require("debug");

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
  const getLinea = () => fetch(process.env.TMB_API_LINEAS)
    .then(resp => resp.json())
    .then(datos => res.json(
      datos.features.map(linea => ({
        id: linea.properties.CODI_LINIA,
        linea: linea.properties.NOM_LINIA,
        descripcion: linea.properties.DESC_LINIA
      }))
    )); getLinea();
});

app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
app.use((err, req, res, next) => {
  debug(err);
  res.status(500).send({ error: true, mensaje: "Error general" });
});
app.put("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.post("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.delete("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
