const srvConfig = require('./config/server.config');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCommonCSS = new ExtractTextPlugin({
	filename:'common.css',
	allChunks: true
});
const extractAppCSS = new ExtractTextPlugin({
	filename: 'app.css',
	allChunks: true
});

const isProd = process.env.NODE_ENV === 'production';

function cleanEmpty(list) {
	return list.filter(function (item) {
		return item;
	});
}

module.exports = {
	devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',

	entry: {
		app: cleanEmpty([
			'babel-polyfill',
			isProd ? null : 'react-hot-loader/patch',
			isProd ? null : 'webpack-hot-middleware/client',
			'./src'
		]),
	},

	output: {
		path: path.join(__dirname, 'builds'),
		filename: 'bundle.js',
		sourceMapFilename: '[file].map',
		publicPath: (srvConfig.basename || '') + '/builds/'
	},

	plugins: cleanEmpty([
		extractCommonCSS,
		isProd ? extractAppCSS : null,

		isProd ? null : new webpack.HotModuleReplacementPlugin(),

		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
			},
			__VERSION__: JSON.stringify(Date.now()),
		}),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./builds/vendor-manifest.json')
		}),

		new webpack.IgnorePlugin(/\.config/),

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
		loaders: [
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
			{
				test: /\.scss/,
				use: isProd ? extractAppCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=bdp_[local]_[hash:base64:5]!postcss-loader?sourceMap=inline!sass-loader?sourceMap',
				}) : [
					'style-loader',
					'css-loader?sourceMap&modules&importLoaders=1&localIdentName=bdp_[local]_[hash:base64:5]',
					'postcss-loader?sourceMap=inline',
					'sass-loader?sourceMap'
				],
				exclude: /style/,
			},
			{
				test: /\.scss/,
				use: isProd ? extractAppCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader?sourceMap&importLoaders=1!postcss-loader?sourceMap=inline!sass-loader?sourceMap',
				}) : [
					'style-loader',
					'css-loader?sourceMap&importLoaders=1',
					'postcss-loader?sourceMap=inline',
					'sass-loader?sourceMap',
				],
				include: /style/
			},
			{
				test: /\.css/,
				use: extractCommonCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},
			{
				test: /\.(woff|woff2|svg|eot|ttf)/,
				use: [
					{
						loader: 'file-loader',
						options: {
							prefix: 'font/',
						},
					},
				],
			},
			{
				test: /\.(png|gif|jpe?g|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							prefix: 'img/',
						},
					},
				],
			},
		]
	},

	resolve: {
		modules: ['node_modules', path.resolve('./src')],
	},
};
