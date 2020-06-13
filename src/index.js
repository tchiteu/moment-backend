require("dotenv-safe").config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3000;

console.log(`[SERVIDOR]: Rodando na porta ${port}`)
app.listen(process.env.PORT || 3000);