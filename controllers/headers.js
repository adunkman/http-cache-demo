module.exports = function (app) {
  app.get("/request", send_headers);
  app.post("/request", update_headers);
};

var send_headers = function (req, res) {
  res.send(200);
};

var update_headers = function (req, res) {
  res.send(200);
};
