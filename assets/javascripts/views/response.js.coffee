class App.Views.Response extends Backbone.View
  initialize: () ->
    @listenTo(@model, "request", @render)
    @listenTo(@model, "sync", @render)

    @render()

  render: () ->
    html = JST["templates/response"](@model.toJSON())
    @$el.html(html)
