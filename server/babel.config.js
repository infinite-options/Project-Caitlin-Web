module.exports = api => {
	api.cache( true );
	
	return {
		'presets': [
			'@babel/preset-env',
			'@babel/preset-react',
			'@babel/preset-typescript'
		],
		'plugins': [
			'react-hot-loader/babel',
			[
				'@babel/plugin-proposal-decorators',
				{
					'legacy': true
				}
			],
			'transform-class-properties'
		]
	};
};
