var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 当数据库连接成功的时候触发
mongoose.connect('mongodb://127.0.0.1:27017/shop');
mongoose.connection.on('connected', function () {
  console.log('Mongodb connected success');
})
// 当数据库连接失败的时候触发
mongoose.connection.on('error', function () {
  console.log('Mongodb connected fail');
})
// 当数据库连接关闭的时候触发
mongoose.connection.on('disconnected', function () {
  console.log('Mongodb connected disconnected')
})

router.get('/list', function (req, res, next) {
  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  let page = +req.param("page") || 1;     // 第几页
  let pagesize = +req.param("pagesize") || 8; // 每页多少条
  let priceGt = '', priceLte = '';
  let skip = (page - 1) * pagesize;   // 跳过多少条
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  // limit(8) 显示8条数据  skip(2) 跳过2条数据
  let goodModel = Goods.find(params).limit(pagesize).skip(skip);
  goodModel.sort({ 'salePrice': sort });
  goodModel.exec({}, function (err, docs) {
    // console.log(docs);
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        result: docs
      })
    }

  })
})

// 加入购物车
router.post('/addCart', function (req, res, next) {
  if (req.cookies.userId) {
    var userId = req.cookies.userId;
  } else {
    res.json({
      status: '1',
      msg: '用户信息不存在'
    })
  }
  let productId = req.body.productId;
  var User = require('../models/user');
  // 查询用户Id
  User.findOne({ userId: userId }, function (err, userDoc) {
    let goodsItem = '';
    // 当添加商品的时候，先去数据库里面查询一下，这个商品是否存在，
    // 如果存在，就让他的productId加1，如果不存在，就添加这个商品
    userDoc.cartList.forEach(function(item) {
      // 如果购物车里面的id和现在要添加的商品ID一样就让它productNum加1
      if (item.productId === productId) {
        // 此时把相同的产品赋值一个变量
        goodsItem = item;
        item.productNum++;
      }
    })

    if (goodsItem) {
      // 说明你购物车里面存在这个商品
      userDoc.save(function (err3, doc3) {
        if (err3) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '0',
            result: '商品添加成功'
          })
        }
      })
    } else {
      // 此时的逻辑是当商品第一次添加到购物车里面
      // 查询productId 把该商品存入user的cartList里面
      Goods.findOne({ productId: productId }, function (err1, goodsDoc) {
       
        goodsDoc.productNum = 1;
        goodsDoc.checked = 1;
        userDoc.cartList.push(goodsDoc);
        userDoc.save(function (err2, doc2) {
          if (err2) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: '第一次加入',
              rusult: doc2
            })
          }
        })
      })
    }
  })
})

module.exports = router;