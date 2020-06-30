let responseObject = {
  status: "SUCCESS",
  statusCode: 200,
  type: "",
  error: "",
  data: ""
};

const success = (data, type, code = 0) => {
  let robj = { ...responseObject };
  robj.status = "SUCCESS";
  robj.statusCode = 200;
  if (code) {
    robj.statusCode = code;
  }
  robj.error = null;
  robj.data = data;
  robj.type = type;
  return robj;
};

const failure = (errMessage, type = "FAIL", code = 0) => {
  let robj = { ...responseObject };
  robj.status = "FAILURE";
  robj.statusCode = 400;
  if (code) {
    robj.statusCode = code;
  }
  robj.data = null;
  robj.error = errMessage;
  robj.type = type;
  return robj;
};

const getResponseBody =  (func, type, data, code = 0) => {
  return func(data, type, code);
  // return send(res, response.statusCode, response);
};

module.exports = {
  getResponseBody,
  success,
  failure
};
