//= require vendor/jquery
//= require vendor/underscore
//= require vendor/backbone
//= require handlebars/dist/handlebars.runtime
//= require socket.io/node_modules/socket.io-client/dist/socket.io

//= require_self

//= require_tree models
//= require_tree templates
//= require_tree views

var App = { Models: {}, Views: {} };

$(document).ready(function () {
  App.socket = io.connect();

  var request = new App.Models.Request();
  var server = new App.Models.Server();
  var cache = new App.Models.Cache();

  request.on("request", function () {
    server.reset();
    cache.reset();
  });

  new App.Views.ResponseIndicator({ model: cache, el: $(".js-cache") });
  new App.Views.ResponseIndicator({ model: server, el: $(".js-server") });
  new App.Views.Request({ model: request, el: document });
  new App.Views.Response({ el: $(".js-header-form") });
});
