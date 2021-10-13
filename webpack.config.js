import path from 'path';
const __dirname = path.resolve();

export default {
    entry:'./public/js/scripts.js',
    output:{
        path: path.resolve(__dirname,'./public/js/'),
        filename:'main.js',
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:['@babel/plugin-transform-runtime']
                    },
                },
            },
        ],
    },
};