require("dotenv-safe").config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(routes);

const port = process.env.PORT || 3000;

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.moment.works/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.moment.works/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.moment.works/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

process.on('SIGINT', () => { console.info("Até mais!"); process.exit(); });

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
