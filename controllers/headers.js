var child = require("child_process");
var response_headers = [];

module.exports = function (app) {
  app.get("/request", make_request_through_proxy);
  app.get("/request/internal", respond_to_proxy_request);
  app.post("/request", update_headers);
};

var update_headers = function (req, res) {
  response_headers = parse_incoming_headers(req.body.headers);
  res.send({ headers: response_headers });
};

var parse_incoming_headers = function (questionable_headers) {
  var valid_headers = [];

  for (var i = 0, length = questionable_headers.length; i < length; i++) {
    var header = questionable_headers[i];
    var parts = header.split(":");

    if (parts.length >= 2 && parts[0].trim().length && parts[1].trim().length) {
      valid_headers.push(header)
    }
  };

  return valid_headers;
};

var respond_to_proxy_request = function (req, res) {
  for (var i = 0, length = response_headers.length; i < length; i++) {
    var parts = response_headers[i].split(":");
    var name = parts.shift();
    var value = parts.join(":");

    res.setHeader(name, value);
  }
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
