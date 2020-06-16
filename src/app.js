const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateIdMiddleware(req, res, next) {
  const repository = repositories.findIndex(x => x.id === req.params.id);
  if (repository < 0) return res.status(400).json({ erro: `O Id '${id}' não foi econtrado nos repositórios.` });
  return next();
}

app.get("/repositories", (req, res) => (res.status(200).json(repositories)));

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return res.status(201).json(repository);
});

app.put("/repositories/:id", validateIdMiddleware, (req, res) => {
  const { title, url, techs } = req.body;
  const repository = repositories[repositories.findIndex(x => x.id === req.params.id)];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  return res.status(200).json(repository);
});

app.delete("/repositories/:id", validateIdMiddleware, (req, res) => {
  repositories.splice(repositories.findIndex(x => x.id === req.params.id), 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", validateIdMiddleware, (req, res) => {
  const repository = repositories[repositories.findIndex(x => x.id === req.params.id)];
  repository.likes += 1;
  return res.status(201).json(repository);
});

module.exports = app;
