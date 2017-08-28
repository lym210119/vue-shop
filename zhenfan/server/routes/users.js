var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('*', function(req, res, next) {
  res.send('hehe')
})

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
      if (doc) {
        res.json({
          stauts: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    
    }
  })
})

module.exports = router;
