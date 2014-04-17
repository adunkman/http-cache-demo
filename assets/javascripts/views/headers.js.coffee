class App.Views.Headers extends Backbone.View
  events:
    "click .js-make-request": "make_request"

  initialize: () ->
    @request = new App.Models.Request()

    @listenTo(@request, "request", @show_loading_indicator)
    @listenTo(@request, "sync", @hide_loading_indicator)
    @listenTo(@request, "sync", @render)

  make_request: () ->
    @request.fetch()

  render: () ->
    @$(".js-status").text(@request.get("status"))
    @$(".js-server").text(@request.get("server"))
    @$(".js-cache").text(@request.get("cache"))

  show_loading_indicator: () ->
    console.log("loading");

  hide_loading_indicator: () ->
    console.log("completed");
