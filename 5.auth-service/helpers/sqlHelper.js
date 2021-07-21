import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

class SqlHelper {

constructor(){
    this.connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.ROOT,
      database: process.env.DB,
      password: ''
      });
      
      this.connectionValid = false;
      this.connection.connect(function (err) {
        if (err) {
          this.connectionValid = false;
        } else {
          this.connectionValid = true;
        }
      });
}


// TODO return the id from result
insert(sql){
    return new Promise((resolve, reject) => {
      this.connection.query(sql, function (err, result) {
        if (err) {
          reject("Database insertion failed");
        } else {
          console.log("1 record inserted");
          resolve(result);
        }
      })
    });
  }
  
  select(sql){
    return new Promise((resolve, reject) => {
      this.connection.query(sql, function (err, result) {
        if (err) {
          reject("Database selection failed");
        } else {
          resolve(result);
        }
      })
    });
  }

  update(sql){
    return new Promise((resolve, reject) => {
      this.connection.query(sql, function (err, result) {
        if (err) {
          reject("Database update failed");
        } else {
          resolve(result);
        }
      })
    });
  }

  delete(sql){
    return new Promise((resolve, reject) => {
      this.connection.query(sql, function (err, result) {
        if (err) {
          reject("Database deletion failed");
        } else {
          resolve(result);
        }
      })
    });
  }
}

export default SqlHelper;
