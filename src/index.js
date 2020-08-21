require("dotenv-safe").config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(routes);

const port = process.env.PORT || 3000;

console.info(`[SERVIDOR]: Rodando na porta ${port}`);
process.on('SIGINT', () => { console.info("Até mais!"); process.exit(); });

app.listen(process.env.PORT || 3000);