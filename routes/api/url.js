const express = require("express");
const router = express.Router();

const { Url, Stats } = require("../../dbtables");

const db = require("../../dbfn.js");
const { getResponseBody, success, failure } = require("../../helper");

const config = require("../../config.json");
const conf = config[config.env];

const path = require("path");

const makeShort = (id) => {
  let num = +id;
  if (num <= 0) {
    return null;
  }
  const map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortUrl = [];
  while (num > 0) {
    shortUrl.push(map[num % 62]);
    num = num / 62;
    num = num | 0;
  }
  return shortUrl.reverse().join("");
};

const getLong = (short) => {
  id = 0;
  for (i = 0; i < short.length; i++) {
    let ch = short[i].charCodeAt(0);
    if ("a" <= short[i] && short[i] <= "z")
      id = id * 62 + ch - "a".charCodeAt(0);
    if ("A" <= short[i] && short[i] <= "Z")
      id = id * 62 + ch - "A".charCodeAt(0) + 26;
    if ("0" <= short[i] && short[i] <= "9")
      id = id * 62 + ch - "0".charCodeAt(0) + 52;
  }
  return id;
};

const shortener = async (req, res) => {
  const data = req.body;
  const record = await db.post(Url, data);
  if (!record) {
    const response = getResponseBody(
      failure,
      "SHORT_FAIL",
      "Internal server error!",
      500
    );
    return res.status(response.statusCode).json(response);
  }
  const shortUrl = makeShort(record.id);
  if (!shortUrl) {
    const response = getResponseBody(
      failure,
      "SHORT_FAIL",
      "Failed to shorten given Url!"
    );
    return res.status(response.statusCode).json(response);
  }
  const actual_short_url = `${conf.siteUrl}/${shortUrl}`;
  const response = getResponseBody(success, "SHORT_OK", {
    short_url: actual_short_url,
  });
  return res.status(response.statusCode).json(response);
};

const expander = async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const id = +getLong(shortUrl);
  const record = await db.get(Url, id);
  if (!record) {
    return res.redirect("/");
    // const response = getResponseBody(
    //   failure,
    //   "LONG_FAIL",
    //   "Failed to expand the short Url!"
    // );
    // return res.status(response.statusCode).json(response);
  }
  await db.post(Stats, { url_id: id });
  await db.put(Url, id, { visits: record.visits + 1 });
  return res.redirect(record.long_url);
};
const analytics = async (req, res) => {
  const shortUrl = req.body.short_url;
  const id = +getLong(shortUrl);
  const record1 = await db.get(Url, id);
  const record = await db.getWhere(Stats, {
    url_id: +id,
  });
  if (!record) {
    const response = getResponseBody(
      failure,
      "LONG_FAIL",
      "Failed to expand the short Url!"
    );
    return res.status(response.statusCode).json(response);
  }
  const nn = new Date();
  const response = getResponseBody(success, "ANAL_OK", {
    count: record.length,
    created: record1.created_at,
    last24: record.filter((item) => item),
  });
  return res.json(response);
};

const main = (req, res) => {
  return res.render("main");
  // return res.sendFile(path.join(__dirname, "public", "index.html"));
};

router.get("/", main);
router.get("/:shortUrl", expander);
router.post("/api/v1/shorten", shortener);
router.post("/api/v1/analytics", analytics);

module.exports = router;
