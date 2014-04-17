class App.Views.Request extends Backbone.View
  events:
    "click .js-make-request": "make_request"
    "change .js-force-reload": "set_request_forcefulness"

  initialize: () ->
    @request = new App.Models.Request()

    @listenTo(@request, "request", @show_loading_indicator)
    @listenTo(@request, "sync", @hide_loading_indicator)
    @listenTo(@request, "sync", @render)

    @render()

  make_request: () ->
    @request.fetch()

  set_request_forcefulness: (evt) ->
    @request.force_reload = $(evt.target).is(":checked")

  render: () ->
    header_list = JST["templates/header_list"]

    @$(".js-server").html(header_list(@request.get("server")))
    @$(".js-cache").html(header_list(@request.get("cache")))
    @$(".js-client").html(header_list(@request.get("client")))

  show_loading_indicator: () ->
    console.log("loading");

  hide_loading_indicator: () ->
    console.log("completed");
