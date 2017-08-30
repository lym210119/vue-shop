var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// 登录接口
router.post('/login', function(req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  
  User.findOne(param, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: '用户名或密码错误！'
      })
    } else {
      // 种cookes
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000 * 60 * 60
      })
      res.cookie('userName', doc.userName, {
        path: '/',
        maxAge: 1000 * 60 * 60
      })
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    
    }
  })
})

// 判断当前用户是否登录
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

// 退出登录
router.post('/loginOut', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

// 查询购物车列表
router.get('/cartList', function(req, res, next) {
  let userId = req.cookies.userId;
  console.log(userId);
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.messgae,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          stutus: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 购物车数量操作
router.post('/cartEdit', function(req, res, next) {
  let userId = req.cookies.userId;
  productId = req.body.productId;
  productNum = req.body.productNum;

  // 通过userId和cartList.productId确定一件商品来对商品数量的操作
  User.update({"userId": userId, "cartList.productId":productId}, {
    "cartList.$.productNum": productNum
  }, function(err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '商品更新成功'
      })
    }
  })
})

router.get('*', function(req, res, next) {
  res.send('hehe')
})
module.exports = router;
