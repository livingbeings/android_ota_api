const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');

class authentication {
  constructor() {
    if (!fs.existsSync("./authentication.db"))
      fs.writeFileSync("./authentication.db", "");
    this.db = new sqlite3.Database("./authentication.db", sqlite3.OPEN_READWRITE,
      (err) => {
        if (err)
          throw err
        this.db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username,password,project)", [],
          (err) => {
            if (err)
              throw err
            this.query().then(users => {
              if (users.length == 0) {
                if (!process.env.initDB)
                  throw new Error("initDB environment variable not loaded")
                let initDB = JSON.parse(process.env.initDB);
                for (let db of initDB)
                  this.register(db.username, db.password, db.project)
              }
            })
          }
        );
      }
    );
  }
  register(username, password, project) {
    return new Promise((resolve, reject) => {
      try {
        this.db.run("INSERT INTO users(username,password,project) VALUES(?,?,?)", [username, password, project], (e) => { if (e) { reject(e) } resolve(true) })
      } catch (e) { reject(e) }
    })
  }
  delete_user(id) {
    return new Promise((resolve, reject) => {
      try {
        this.db.run("DELETE FROM users WHERE id=?", [id], (e) => { if (e) { reject(e) } resolve(true) })
      } catch (e) { reject(e) }
    })
  }
  query(query = '') {
    return new Promise((resolve, reject) => {
      try {
        if (query == '')
          this.db.all("SELECT * FROM users", [], (e, i) => { if (e) { reject(e) } resolve(i) })
        else
          this.db.all("SELECT * FROM users WHERE " + query, [], (e, i) => { if (e) { reject(e) } resolve(i) })
      } catch (e) { reject(e) }
    })
  }
  erase_db() {
    return new Promise((resolve, reject) => {
      try {
        this.db.run("DROP * FROM users", [], (e) => { if (e) { reject(e) } resolve(true) })
      } catch (e) { reject(e) }
    })
  }
  update(id, username, password, project) {
    return new Promise((resolve, reject) => {
      try {
        let old_username, old_password, old_project;
        this.query(`id=${id}`).then(info => {
          if (info.length == 0)
            reject(new Error("id not found"))
          info = info[0];
          old_username = info.username;
          old_password = info.password;
          old_project = info.project;
          if (typeof (username) == 'undefined')
            username = old_username
          if (typeof (password) == 'undefined')
            password = old_password
          if (typeof (project) == 'undefined')
            project = old_project
          this.db.run("UPDATE users SET username=?,password=?,project=? WHERE id=?", [username, password, project, id], (e) => { if (e) { reject(e) } resolve(true) })
        })
      } catch (e) { reject(e) }
    })
  }
}

module.exports = authentication
