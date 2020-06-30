const { Model } = require("objection");
const Knex = require("knex");

const config = require("./config.json");

const conf = config[config.env];

const knex = Knex(conf.dbconfig);

Model.knex(knex);

module.exports = {
  Model,
  knex,
};
