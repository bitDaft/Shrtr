const getAll = async table => {
  return table.query();
};

const get = async (table, id) => {
  return table.query().findById(id);
};

const getWhere = async (table, criteria) => {
  return table.query().where(criteria);
};

const post = async (table, data) => {
  return table.query().insert(data);
};

const put = async (table, id, data) => {
  return table.query().patchAndFetchById(id, data);
};

const del = async (table, id) => {
  return table.query().deleteById(id);
};

module.exports = {
  getAll,
  get,
  getWhere,
  put,
  post,
  del
};
