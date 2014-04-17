class App.Views.Headers extends Backbone.View
  events:
    "click .js-make-request": "make_request"

  initialize: () ->
    @request = new App.Models.Request()
    @form = new App.Views.HeaderForm(el: @$(".js-header-form"))

    @listenTo(@request, "request", @show_loading_indicator)
    @listenTo(@request, "sync", @hide_loading_indicator)
    @listenTo(@request, "sync", @render)

    @render()

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
