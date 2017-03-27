// jscs:disable
var webpack = require('webpack');
var fs =  require('fs');
var path = require('path');

function getEnvVars() {
	return {
		'process.env': {
			'NODE_ENV': JSON.stringify('production'),
		}
	};
}

function getExternals() {
  const nodeModules = fs.readdirSync(path.resolve(__dirname, 'node_modules'));
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = `commonjs ${mod}`;
    return ext;
  }, {});
}

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/server/server.js',
  output: {
    path: __dirname + '/build/server',
    filename: 'index.js'
  },
  externals: getExternals(),
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    rules: [{
        test: /\.js$/,
        //should es2015 be [es2015, {modules:false}]?
        loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-2',
        include: path.join(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      {
        //not clear if this require will work
        banner: 'require("source-map-support").install();',
        raw: true, 
        entryOnly: false
      }
    ),
    new webpack.IgnorePlugin(/\.(css|less|scss|svg|png|jpe?g|png)$/),
    new webpack.DefinePlugin(getEnvVars())
  ]
};
