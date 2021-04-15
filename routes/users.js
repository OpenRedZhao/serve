var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const {PWD_SALT, PRIVATE_KEY, EXPIRESD} = require('../utils/constant')
const {md5, upload} = require('../utils/index')
const jwt = require('jsonwebtoken')

/* 注册接口 */
router.post('/register', async(req, res, next) => {
  let {username, password, nickname} = req.body
  try{
    let user =  await querySql('select * from user where username = ?', [username])
    if(!user || user.length === 0) {
      password = md5(`${password}${PWD_SALT}`)
      await querySql('insert into user(username, password, nickname) value (?, ?, ?) ', [username, password, nickname])
      res.send({code:0, msg:'注册成功'})
    }else{
      res.send({code:-1, msg:'该账号已注册'})
    }
  }catch(e){
    console.log(e)
    next(e)
  }
});
 
//登录接口
router.post('/login', async(req, res, next) => {
  let {username, password} = req.body
  try {
    let user =  await querySql('select * from user where username = ?', [username])
    if(!user|| user.length === 0) {
      res.send({code:-1, msg:'该账号不存在'})
    }else{
      password = md5(`${password}${PWD_SALT}`)
      let result = await querySql('select * from user where username = ? and password = ?', [username, password])
      if(!result || result.length === 0){
        res.send({code:-1, msg:'账号或密码不正确'})
      }else{
         // 判断账号和密码是否对应
      if (username === '18289399013') {
        let  menu = [
          {
              path: '/',
              name: 'home',
              label: '首页',
              icon: 's-home',
              url: 'Home/Home'
          },
          {
              path: '/video',
              name: 'video',
              label: '视频管理页',
              icon: 'video-play',
              url: 'VideoManage/VideoManage'
          },
          {
              path: '/user',
              name: 'user',
              label: '用户管理页',
              icon: 'user',
              url: 'UserManage/UserManage'
          },
          {
              label: '发布管理页',
              icon: 'location',
              children: [
              {
                  path: '/page1',
                  name: 'page1',
                  label: '发布列表',
                  icon: 'setting',
                  url: 'Other/PageOne'
              },
              {
                  path: '/page2',
                  name: 'page2',
                  label: '页面',
                  icon: 'setting',
                  url: 'Other/PageTwo'
              }
          ]
       }
     ]
      //生成token 存储信息 密钥 过期时间
      let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn:EXPIRESD})
      res.send({code:0, msg:'登录成功', token: token, menu: menu})
    } else {
        let  menu = [
          {
              path: '/',
              name: 'home',
              label: '首页',
              icon: 's-home',
              url: 'Home/Home'
          },
          {
              path: '/video',
              name: 'video',
              label: '视频管理页',
              icon: 'video-play',
              url: 'VideoManage/VideoManage'
          },
          {
              path: '/user',
              name: 'user',
              label: '用户管理页',
              icon: 'user',
              url: 'UserManage/UserManage'
          }
      ]
       //生成token 存储信息 密钥 过期时间
       let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn:EXPIRESD})
       res.send({code:0, msg:'登录成功', token: token, menu: menu})
    }
       
      }
    }
  }catch(e){
    console.log(e)
    next(e)
  }
});

//获取用户信息接口
router.get('/info', async(req, res, next) => {
  let {username} = req.user
  try {
    let userinfo = await querySql('select nickname, head_img from user where username = ?',[username])
    res.send({code:0, msg:'成功', data:userinfo[0]})
  }catch(e){
    console.log(e)
    next(e)
  }
});

//头像上传接口
router.post('/upload', upload.single('head_img'), async(req, res, next) => {
  console.log(req.file)
  let imgPath = req.file.path.split('public')[1] //分割前部分看作数组 0 后部分看作数组 1
  let imgUrl = 'http://115.28.130.168:3000' +  imgPath //地址拼接
  res.send({code:0, msg:'上传成功', data:imgUrl})
});

//用户信息更新接口
router.post('/updateUser', async(req, res, next) => {
  let {nickname, head_img} = req.body
  let {username} = req.user
  try {
    let result = await querySql('update user set nickname = ? , head_img = ? where username = ?', [nickname,head_img,username])
    console.log(result)
    res.send({code:0, msg:'更新成功', data:null})
  }catch(e){
    console.log(e)
    next(e)
  }
});


module.exports = router;
