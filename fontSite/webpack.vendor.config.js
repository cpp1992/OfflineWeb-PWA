/**
 * Created by jiljiang on 2016/10/12.
 */

const srvConfig = require('./config/server.config');
const path = require('path');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

function cleanEmpty(list) {
	return list.filter(function (item) {
		return item;
	});
}

module.exports = {
	devtool: 'source-map',

	entry: {
		vendor: [
			'admin-lte',
			'bootstrap',
			'bdp-components',
			'classnames',
			'immutable',
			'moment',
			'jquery',
			'prop-types',
			'react',
			'react-css-modules',
			'react-dom',
			'react-redux',
			'react-router',
			'react-router-dom',
			'redux',
			'redux-logger',
			'redux-thunk',
			'warning',
		],
	},

	output: {
		path: path.join(__dirname, 'builds'),
		publicPath: (srvConfig.basename || '') + '/builds/',
		filename: '[name].bundle.js',
		library: '[name]',
	},

	plugins: cleanEmpty([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
			},
		}),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		new webpack.DllPlugin({
			context: __dirname,
			path: path.join(__dirname, 'builds', '[name]-manifest.json'),
			name: '[name]'
		}),

		isProd ? new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			minimize: true,
			sourceMap: true,
			mangle: {
				screw_ie8: true,
				keep_fnames: true,
			},
			compress: {
				screw_ie8: true,
			},
			comments: false,
		}): null,
	]),

	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
				exclude: /node_modules/,
				include: __dirname
			},
		]
	},

	resolve: {
		modules: ['node_modules']
	},
};
