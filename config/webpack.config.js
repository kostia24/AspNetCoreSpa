var path = require('path');
var webpack = require('webpack');
var merge = require('extendify')({ isDeep: true, arrays: 'concat' });
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('styles.css');
var devConfig = require('./webpack.config.dev');
var prodConfig = require('./webpack.config.prod');
var isDevelopment = process.env.ASPNETCORE_ENVIRONMENT === 'Development';

module.exports = merge({
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, exclude: [/\.(spec|e2e)\.ts$/], loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
            { test: /\.html$/, loader: "html" },
            { test: /\.css/, loader: extractCSS.extract(['css']) },
            { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader?sourceMap'] },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }]
    },
    entry: {
        'polyfills': './Client/polyfills.ts',
        'vendor':    './Client/vendor.ts',
        'main': './Client/boot-client.ts'
    },
    output: {
        path: path.join(__dirname, '../wwwroot', 'dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    profile: true,
    plugins: [
        extractCSS,
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('../wwwroot/dist/polyfills-manifest.json')
        // }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('../wwwroot/dist/vendor-manifest.json')
        // }),
        // To eliminate warning
        // https://github.com/AngularClass/angular2-webpack-starter/issues/993
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            __dirname
        ),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor'].reverse()
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(process.env.ASPNETCORE_ENVIRONMENT)
            }
        })
    ]
}, isDevelopment ? devConfig : prodConfig);
