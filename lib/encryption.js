const crypto = require('crypto-js');

class Encryption {
  constructor() {
    this.encrypt_key = new Date().getTime().toString();
  };
  encrypt(id) {
    let response = {};
    let str = id + "&&" + new Date().getTime().toString();
    response.token = crypto.AES.encrypt(str, this.encrypt_key).toString();
    response.user = id;
    return response
  }
  decrypt(token) {
    if (token == null)
      return null
    let decrypted = crypto.AES.decrypt(token, this.encrypt_key);
    return new Buffer.from(decrypted.toString(), 'hex').toString('utf8')
  }
  check_token(token) {
    let str = this.decrypt(token);
    let key, user, time;
    try {
      key = str.match(/(\S+)\&\&(\S+)/);
      user = JSON.parse(key[1]);
      time = key[2];
    } catch (e) {
      return null;
    }
    time = new Date(Number(time));
    let curr = new Date().getTime();
    if (curr - time > limit)
      return null;
    return user;
  }
};

module.exports = Encryption;
