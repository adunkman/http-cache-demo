class App.Views.Request extends Backbone.View
  events:
    "click .js-make-request": "make_request"
    "change .js-force-reload": "set_request_forcefulness"

  initialize: () ->
    @listenTo(@model, "request", @show_loading_indicator)
    @listenTo(@model, "sync", @hide_loading_indicator)
    @listenTo(@model, "sync", @render)

    @render()

  make_request: () ->
    @model.fetch()

  set_request_forcefulness: (evt) ->
    @model.force_reload = $(evt.target).is(":checked")

  render: () ->
    header_list = JST["templates/header_list"]

    @$(".js-client").html(header_list(@model.get("client")))

  show_loading_indicator: () ->
    console.log("loading");

  hide_loading_indicator: () ->
    console.log("completed");
