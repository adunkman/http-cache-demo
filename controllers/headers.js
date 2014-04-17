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

  make_squidclient_request_to(url, function (err, responses) {
    if (err) res.send(500, err);
    else res.send(responses)
  });
};

var expand_to_full_url = function (server, path) {
  var info = server.address();
  return "http://" + info.address + ":" + info.port + path;
};

var make_squidclient_request_to = function (url, callback) {
  child.exec("squidclient " + url, function (err, stdout) {
    if (err) callback(err);
    else parse_proxy_response(stdout.toString(), callback);
  });
};

var parse_proxy_response = function (response, callback) {
  var err;
  var responses;

  try {
    responses = {
      status: response.split("\n")[0],
      server: null,
      cache: response
    };

    if (response.indexOf("X-Cache: MISS") !== -1) {
      responses.server = response.replace(/(X-Cache: .+\r\n|Via: .+\r\n)/g, "");
    }
  }
  catch (e) {
    err = e;
  }

  callback(err, responses);
};
