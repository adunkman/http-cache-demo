class App.Models.Request extends Backbone.Model
  url: () -> "/request#{if @force_reload then "?force_reload=true" else ""}"
