const express = require("express");
const app = express();
var exphbs = require("express-handlebars");

const url = require("./routes/api/url");

app.engine("hbs", exphbs({ defaultLayout: "index", extname: ".hbs" }));
app.set("view engine", "hbs");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//   res.send("hello world!!");
// });

// url api routes
app.use("/", url);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`url shortener listening at http://localhost:${PORT}`)
);
