var express = require("express");
var app = express();

app.disable("x-powered-by");

app.use(require("morgan")("dev"));

require("./controllers/static")(app);
require("./controllers/headers")(app);

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on", this.address());
});
