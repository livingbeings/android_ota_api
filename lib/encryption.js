const crypto = require('crypto-js');

class Encryption {
  constructor() {
    this.encrypt_key = new Date().getTime().toString();
    this.limit = 24 * 60 * 60 * 1000;
  };
  encrypt(data) {
    let str = data + "&&" + new Date().getTime().toString();
    return crypto.AES.encrypt(str, this.encrypt_key).toString();
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
    if (curr - time > this.limit)
      return null;
    return user;
  }
};

module.exports = Encryption;
