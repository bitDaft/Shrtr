const { Model, knex } = require("./initdb.js");

class Url extends Model {
  static get tableName() {
    return "url_test";
  }
}
class Stats extends Model {
  static get tableName() {
    return "url_statistics";
  }
}

module.exports = {
  Model,
  knex,

  // Tables
  Url,
  Stats,
};
