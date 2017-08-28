var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "productImage": String,
      "salePrice": Number,
      "productNum": String,
      "productUrl": String,
      "checked": String
    }
  ],
  "addressList": Array
});

module.exports = mongoose.model('user', userSchema);
