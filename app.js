var path = require('path');
var routes = require('./routes');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var multer = require('multer');
//var upload = multer();  // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.use(upload.array());


// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 路由
routes(app);

app.listen(3000);