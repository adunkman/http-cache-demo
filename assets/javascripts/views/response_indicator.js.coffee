class App.Views.ResponseIndicator extends Backbone.View
  initialize: () ->
    @listenTo(@model, "change:responded", @render)

  render: () =>
    @$el.toggleClass("responded", @model.get("responded"))
