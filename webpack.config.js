var path = require('path');
var webpack = require('webpack');

module.exports = {
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    resolve: {
        root: [path.join(__dirname, 'app/lib'), path.join(__dirname, 'app/src')],
        extensions: ['', '.js'],
        alias: {
            jasmine: __dirname + '/app/lib/jasmine/lib/jasmine-core/',
            famous: __dirname + '/app/lib/famous/src',
            'famous-flex': __dirname + '/app/lib/famous-flex/src',
            'dat-gui': __dirname + '/app/lib/dat.gui.js/build/dat.gui.js'
        }
    },
    module: {
        loaders: [{
            //图片加载器
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            //css加载器
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],
    devtool: 'source-map'
};
