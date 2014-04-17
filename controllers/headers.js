var child = require("child_process");

module.exports = function (app) {
  app.get("/request", make_request_through_proxy);
  app.get("/request/internal", respond_to_proxy_request);
  app.post("/request", update_headers);
};

var update_headers = function (req, res) {
  res.send(200);
};

var respond_to_proxy_request = function (req, res) {
  res.send("An otherwise empty response.");
};

var make_request_through_proxy = function (req, res) {
  var url = expand_to_full_url(req.connection.server, "/request/internal");
  var proxy_request = make_squidclient_request_to(url);

  proxy_request.pipe(res);
};

var expand_to_full_url = function (server, path) {
  var info = server.address();
  return "http://" + info.address + ":" + info.port + path;
};

var make_squidclient_request_to = function (url) {
  return child.spawn("squidclient", [ url ]).stdout;
};
