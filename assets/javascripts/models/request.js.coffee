class App.Models.Request extends Backbone.Model
  url: () -> "/request#{if @force_reload then "?force_reload=true" else ""}"

  parse: (response, options) ->
    response.client =
      status: "#{options.xhr.status} #{options.xhr.statusText}"
      headers: _.filter(options.xhr.getAllResponseHeaders().split("\r\n"), (h) -> h)

    for r in [ "server", "cache", "client" ]
      response[r].headers = @tidy_up_headers(response[r].headers)

    response

  tidy_up_headers: (headers) ->
    headers = _.map headers, (h) =>
      [key, value] = h.split(": ")
      key: @to_title_case(key)
      value: value

    headers.sort((a, b) -> if a.key > b.key then 1 else -1)

    return headers

  to_title_case: (str) ->
    str.toLowerCase().replace(/\b./g, (c) -> c.toUpperCase())
