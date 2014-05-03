var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);

app.set("io", require("socket.io").listen(server, { "log level": 1 }));
app.set("view engine", "jade");
app.disable("x-powered-by");

app.use(require("morgan")("dev"));
app.use(require("connect-assets")({
  paths: ["assets/fonts", "assets/stylesheets", "assets/javascripts", "node_modules"]
}));
app.use(require("body-parser")());

require("./controllers/static")(app);
require("./controllers/headers")(app);
require("./controllers/cache")(app);

server.listen(process.env.PORT || 3000, function () {
  console.log("listening on", this.address());
});
