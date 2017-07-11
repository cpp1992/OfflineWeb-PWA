import path from 'path';
import fs from 'fs';
import Sequelize from 'sequelize';
import http from 'http';
import https from 'https';
import Express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { list, find } from './list';

const sequelize = new Sequelize('offline_data', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
});

const Item = sequelize.define('table_datadetails', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	brief: {
		type: Sequelize.STRING,
	},
}, {
	createdAt: false,
	updatedAt: false,
});

const app = new (Express)();
const config = require('../../webpack.client.config');

const compiler = webpack(config);

const isProd = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath.replace(/^\./, '') }));
app.use(webpackHotMiddleware(compiler));

app.use('/builds', Express.static('builds'));
app.use('/assets', Express.static('assets'));

// API
app.get('/api/item/list', (req, res) => {
	console.log('Search:', req.query.search);
	/* Item.findAll({
		where: {
			brief: {
				$like: `%${req.query.search}%`,
			},
		},
	}).then((list) => {
		res.json(list);
	}); */
	// Review use local storage for deploy
	res.json(find(req.query.search));
});

app.get('/api/online', (req, res) => {
	res.json({ online: true });
});

app.get('/api/item/:id', (req, res) => {
	console.log('Id:', req.params.id);
	/* Item.findById(req.params.id).then((item) => {
		res.json(item);
	}); */
	res.json(list[req.params.id]);
});

// Render
app.get('/sw.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'sw.js'));
});

app.get('/', (req, res) => {
	res.render(path.resolve(`${__dirname}/../index.ejs`), { isProd });
});

// Server
http.createServer(app).listen(1128, () => {
	console.log('HTTP Server listening [port:1128]...');
});

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../config/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '../../config/cert.pem'), 'utf8');

if (privateKey && certificate) {
	const credentials = { key: privateKey, cert: certificate };
	https.createServer(credentials, app).listen(443, () => {
		console.log('HTTPS Server listening [port:443]...');
	});
}

process.on('SIGTERM', () => {
	console.log('SIGTERM...');
	sequelize.close();
});

process.on('SIGINT', () => {
	console.log('SIGINT...');
	sequelize.close();
});

process.on('message', (msg) => {
	if (msg === 'shutdown') {
		console.log('Shutdown...');
		sequelize.close();

		setTimeout(() => {
			console.log('Finished clean up...');
			process.exit(0);
		}, 1500);
	}
});
