class App.Views.Request extends Backbone.View
  events:
    "click .initiate-request button": "request"
    "keyup": "force_reload_on_alt_key"
    "keydown": "force_reload_on_alt_key"

  initialize: () ->
    @listenTo(@model, "request", @animate_request)
    @listenTo(@model, "sync", _.debounce(@render_response, 400))
    @listenTo(@model, "sync", _.debounce(@animate_request, 500))

  request: () ->
    headers = {}

    headers["Cache-Control"] = "private, max-age=0" if @$(".initiate-request").hasClass("will-force-reload")
    headers["Force-Reload"] = true if @$(".initiate-request").hasClass("will-force-proxy-reload")

    @model.fetch({headers})

  render_response: () ->
    @$(".header-visualizer").html(JST["templates/response"](@model.toJSON()))

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
    @$(".initiate-request").toggleClass("will-force-reload", will_force)
    @$(".initiate-request").toggleClass("will-force-proxy-reload", will_force and evt.shiftKey)
