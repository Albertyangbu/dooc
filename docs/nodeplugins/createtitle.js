// 加载常用类
var fs = require("fs");
var path = require("path");
var fsutil = require("./fsutils.js");
// 获取传入参数
var args = process.argv.splice(2);
// 默认参数
var config = {
    path: '../',
    file: 'README.md',
    ignore: ['icons', 'nodeplugins'],
};
// 解析传入参数
args.forEach(i => {
    if (i.indexOf('=') !== -1) {
        let values = i.split('=');
        let key = values[0];
        let val = values[1];

        // 设置传入参数
        if (config[key] !== undefined) {
            config[key] = val;
        }
    }
});
// 参数打印
console.log('当前参数设置: ' + JSON.stringify(config));

// 切换工作目录
process.chdir(__dirname);
process.chdir(config['path']);
var workPath = process.cwd();

// 读取目录
fs.readdir(workPath, function (err, dirs) {
    if (err) {
        console.error(err);
        return;
    }
    dirs.forEach(dirName => {
        // 判断文件是否为目录
        let dirPath = workPath + path.sep + dirName;
        fs.stat(dirPath, function (err, stats) {
            if (err) {
                console.error(err);
                return;
            }
            // 文件为目录，且非忽略
            let isIgnoreDir = config['ignore'].includes(dirName);
            if (stats.isDirectory() && !isIgnoreDir) {
                // 读取目录内readme文件
                let readmeFilepath = dirPath + path.sep + config['file'];
                // 判断readme是否存在
                if (!fs.existsSync(readmeFilepath)) {
                    // 创建readme文件
                    fs.writeFile(readmeFilepath, ' ', err => console.log(err));
                }

                // 读取readme标题
                fsutil.readFileToArr(readmeFilepath, arr => {
                    let title = arr[0] + "\n";
                    fs.writeFileSync(readmeFilepath, title, err => console.log(err));
                });

                // 读取目录内所有文件
                fs.readdir(dirPath, function (err, files) {
                    files.forEach(filename => {
                        // 跳过readme，包含md后缀
                        if (filename !== config['file'] && filename.indexOf('.md') !== -1) {
                            let filepath = dirPath + path.sep + filename;
                            fsutil.readFileToArr(filepath, arr => {
                                let title = filename.replace('.md', '');
                                if (arr[0].indexOf('#') !== -1) {
                                    // 包含 #则作为目录，否则使用文件名称
                                    title = fsutil.replaceAll(arr[0], '#', '').replace('<!-- {docsify-ignore} -->', '');
                                }
                                title = title.trim();
                                let guide = '* [' + title + '](/' + dirName + '/' + filename.replace('.md', '') + ')\n';
                                fs.appendFileSync(readmeFilepath, guide, err => console.log(err));
                            });
                        }
                    });
                });
            }
        });
    });
});