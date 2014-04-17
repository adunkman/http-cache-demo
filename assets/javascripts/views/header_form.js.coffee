class App.Views.HeaderForm extends Backbone.View
  events:
    "submit": "save_headers"

  initialize: () ->
    @response = new App.Models.Response()

    @listenTo(@response, "request", @show_loading_indicator)
    @listenTo(@response, "sync", @hide_loading_indicator)
    @listenTo(@response, "sync", @render)

    @render()

  save_headers: (evt) ->
    evt.preventDefault()
    @response.save(headers: @$("textarea").val().split("\n"))

  render: () ->
    @$("textarea").val(@response.get("headers")?.join("\n"))

  show_loading_indicator: () ->
    console.log("loading");

  hide_loading_indicator: () ->
    console.log("completed");
