var express = require('express');
var router = express();

var marked = require('marked');

var mongoose = require('mongoose'); 

var url = "mongodb://localhost:27017/myblog";
var db = mongoose.connect(url, { useNewUrlParser: true });

var PostSchema = new mongoose.Schema({ //定义数据模型
  title: String,
  content: String,
  time: String
});
mongoose.model('Post', PostSchema); // 将该 Schema 发布为 Model

var Post = mongoose.model('Post'); // Post 为 model name
mongoose.Promise = global.Promise; // 为了避免警告的出现，因为 mongoose 的默认promise已经弃用了



// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res) {
    Post.find({}, function (err, result) {
        if(err){
            console.log(err);
        }else{
            for(var i = 0;i < result.length;i++){
                result[i].content = marked(result[i].content);
            }
            res.render('index',{
                result: result
            });
        }   
    }).sort({_id: -1});
    
})

// GET /posts/create 发表文章页
router.get('/create', function (req, res) {
    res.render('create');
})

router.post('/create', function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var timestamp = new Date().getTime().toString();

    var post = new Post({
        title: title,
        content: content,
        time: timestamp
      });
    post.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.send('发布成功');
        }
      });
})

// GET /posts/article 文章页
router.get('/article/:time', function (req, res) {
    Post.find({time:req.params.time}, {title: 1, content: 1, time: 1}, function(err, result){
        if(err){
            console.log(err);
        }else{
            var content = marked(result[0].content);
            res.render('article', {
                title: result[0].title,
                content: content
            });
        }
    });
   
})

// GET /posts/edit 更新文章页
router.get('/edit/:time', function (req, res) {
    Post.find({time: req.params.time}, {title: 1, content: 1, time: 1}, function (err, result) {
        if(err){
            console.log(err);
        }else{
            res.render('edit', {
                title: result[0].title,
                content: result[0].content
            });
        }
    });
})

router.post('/edit/:time', function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var timestamp = new Date().getTime().toString();

    Post.update({time: req.params.time}, {title: title, content: content, time: timestamp}, function(err, result){
        if(err){
            console.log(err);
        }else{
            res.send('修改成功');
        }
    });
})

router.get('/delete/:time', function (req, res) {
    Post.remove({time: req.params.time}, function(err, result) {
        if(err){
            console.log(err);
        }else{
            res.send('删除成功');
        }
    })
})

  
module.exports = router