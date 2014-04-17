# http-cache-demo

A demo app to show off how certain HTTP headers change caching behaviors.

## Running the App

First, this app depends on having Squid running on the same machine as this app will be run and the executable `squidclient` available on your `$PATH`. Setting up Squid is outside the scope of this README — but it’s available with `brew install squid` if you’re one of those kinds.

After fetching this repository:

```
npm install
node index.js
```

## Accessing the App

The application prints out its port binding when starting, but unless you’ve set the `PORT` environmental variable, it’s running at `http://localhost:3000/`.

## Toying Around

The app lets you specify response headers (in normal `Header: value` format) that will be sent through Squid and back to the app. Feel free to mess around with things like `Cache-Control` and see how they make Squid respond (be sure to look at the `X-Cache` response header).

It should be pretty straightforward once you get to this point.
