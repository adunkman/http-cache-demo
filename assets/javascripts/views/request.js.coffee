class App.Views.Request extends Backbone.View
  events:
    "click .request button": "request"
    "keyup": "force_reload_on_alt_key"
    "keydown": "force_reload_on_alt_key"

  initialize: () ->
    @listenTo(@model, "request", @animate_request)
    @listenTo(@model, "sync", _.debounce(@render_response, 400))
    @listenTo(@model, "sync", _.debounce(@animate_request, 500))

  request: () ->
    params = {}
    params.force_reload = true if @$(".request").hasClass("will-force-reload")

    @model.fetch(data: $.param(params))

  render_response: () ->
    @$(".response").html(JST["templates/response"](@model.toJSON()))

  animate_request: () =>
    @$el.toggleClass("is-loading", !@model.get("status"))
    @$el.toggleClass("has-response", !!@model.get("status"))
    @$el.attr("data-responded",
      if !@model.get("status") then ""
      else if @model.get("server_response") then "server"
      else if @model.get("cache_response") then "cache"
      else "client"
    )

  force_reload_on_alt_key: (evt) =>
    will_force = evt.altKey and evt.target.tagName not in ["TEXTAREA", "INPUT"]
    @$(".request").toggleClass("will-force-reload", will_force)
