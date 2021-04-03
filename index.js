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
  const getLineas = () => fetch(process.env.TMB_API_LINEAS)
    .then(resp => resp.json())
    .then(datos => res.json(
      datos.features.map(linea => ({
        id: linea.properties.CODI_LINIA,
        linea: linea.properties.NOM_LINIA,
        descripcion: linea.properties.DESC_LINIA
      }))
    )); getLineas();
});

app.get("/metro/linea/:numeroLinea", (req, res, next) => {
  const { numeroLinea } = req.params;
  if (numeroLinea) {
    const getLinea = () => fetch(`${`${process.env.TMB_API_PARADAS}${numeroLinea.slice(1)}`}/estacions?${process.env.TMB_API_KEY}`)
      .then(resp => resp.json())
      .then(datos => res.json({
        linea: datos.features[0].properties.NOM_LINIA,
        descripcion: datos.features[0].properties.DESC_SERVEI,
        paradas: datos.features.map(parada => [{
          id: parada.properties.ID_ESTACIO,
          nombre: parada.properties.NOM_ESTACIO
        }])
      }));
    getLinea();
  }
});

app.put((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});

app.post((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});
app.delete((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});
app.use((err, req, res, next) => {
  debug(err);
  res.status(500).send({ error: true, mensaje: "Error General" });
});
app.get("*", (req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
