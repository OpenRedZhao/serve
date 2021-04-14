var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

/* 新增博客接口 */
router.post('/add', async(req, res, next) => {
  let {title, content, video_url} = req.body
  let {username} = req.user
  try {
    let result = await querySql('select id from user where  username = ?', [username])
    let user_id = result[0].id
    console.log(user_id)
    await querySql('insert into article(title,content,video_url,user_id,create_time)values(?,?,?,?,NOW())',[title,content,video_url,user_id])
    res.send({code:0,msg:'新增成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  }
});

/* 更新博客接口 */
router.post('/update', async(req, res, next) => {
  let {article_id, title, content} = req.body
  let {username} = req.user
  try {
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql,[username])
    let user_id = user[0].id
    let sql = 'update article set title = ? , content = ? where id = ? and user_id = ?'
    let result = await querySql(sql, [title, content, article_id, user_id])
    res.send({code:0,msg:'更新成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  }
});

//删除博客接口
router.post('/delete', async(req, res, next) => {
  let {article_id} = req.body
  let {username} = req.user
  try {
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    let user_id = user[0].id
    let sql = 'delete from article where id = ? and user_id = ?'
    let result = await querySql(sql, [article_id, user_id])
    res.send({code:0, msg:'删除成功', data:null})
  }catch(e){
    console.log(e)
  }
})

//获取全部博客列表接口
router.get('/allList', async(req, res, next) => {
  try {
    let sql = 'SELECT id, title, content, video_url, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time FROM article ORDER BY create_time DESC'
    let result = await querySql(sql)
    res.send({code:0, msg:'获取成功',  data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
});

//获取我的博客列表接口
router.get('/myList', async(req, res, next) => {
  let {username} = req.user
  try {
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    let user_id = user[0].id
    let sql = 'SELECT id, title, content, video_url, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time FROM article WHERE user_id = ? ORDER BY create_time DESC'
    let result = await querySql(sql, [user_id])
    res.send({code:0, msg:'获取成功',  data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
});

//获取博客详情接口
router.get('/detail', async(req, res, next) => {
  let article_id = req.query.article_id //获取前端id
  try {
    let sql = ' select id, title, content, video_url, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id = ?'
    let result = await querySql(sql, [article_id])
    res.send({code:0, msg:'获取成功',  data:result[0]}) //获取只有一个结果 result[0]
  }catch(e){
    console.log(e)
    next(e)
  }
});

//搜索博文
router.post('/search', async(req, res, next)=>{
  let {title} = req.body
  console.log(title)
  try {
    let sql = "SELECT id, title, DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') AS create_time FROM article WHERE title LIKE  '%" + title + "%' "
    console.log(sql)
    let result = await querySql(sql)
    res.send({code:0, msg:'获取成功', data:result})
  }catch(e){
    console.log(e)
    next(e)
  }
})
module.exports = router;
