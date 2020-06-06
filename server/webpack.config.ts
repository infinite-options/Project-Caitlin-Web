import * as path from 'path';
import * as webpack from 'webpack';


export default {
	entry:        [
		'webpack-hot-middleware/client',
		'babel-polyfill',
		path.join( __dirname, '..', 'client', 'app.tsx' )
	],
	output:       {
		path:       path.join( __dirname, '..', 'client', 'public', 'build' ),
		filename:   '[name].bundle.js',
		publicPath: '/build'
	},
	devtool:      'source-map',
	mode:         'development',
	module:       {
		rules: [
			{
				test:   /\.[tj]sx?$/,
				loader: [ 'babel-loader' ]
			},
			{
				test:   /\.css$/,
				loader: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	plugins:      [ new webpack.HotModuleReplacementPlugin() ],
	resolve:      {
		alias:      { 'react-dom': '@hot-loader/react-dom' },
		extensions: [ '.js', '.jsx', '.ts', '.tsx', '.css' ]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	}
};
