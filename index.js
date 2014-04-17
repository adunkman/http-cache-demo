var express = require("express");
var app = express();

app.set("view engine", "jade");
app.disable("x-powered-by");

app.use(require("morgan")("dev"));
app.use(require("connect-assets")({
  paths: ["assets/stylesheets", "assets/javascripts", "node_modules"]
}));
app.use(require("body-parser")());

require("./controllers/static")(app);
require("./controllers/headers")(app);

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on", this.address());
});
