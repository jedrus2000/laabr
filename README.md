![laabr logo](https://github.com/felixheck/laabr/raw/master/assets/logo.png)
#### well-formatted pino logger for hapi.js

> Booyah! Works like a charm.
>
> &mdash; [Marcus Pöhls](https://futurestud.io/tutorials/author/marcus/)

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/laabr/builds/) ![node](https://img.shields.io/node/v/laabr.svg) ![npm](https://img.shields.io/npm/dt/laabr.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/laabr.svg)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API](#api)
5. [Tokens](#tokens)
6. [Formats](#formats)
7. [Presets](#presets)
8. [Example](#example)
9. [Developing and Testing](#developing-and-testing)
10. [Contribution](#contribution)
11. [License](#license)

## Introduction
**laabr** is a well-formatted [pino](https://github.com/pinojs/pino) logger for [hapi.js](https://github.com/hapijs/hapi) which is based on the plugin [hapi-pino](https://github.com/pinojs/hapi-pino). It enables optionally to log in JSON for easy post-processing. It listens to various [hapi.js events](https://github.com/pinojs/hapi-pino#hapi-events) and logs in a well-formatted manner. Therefor it is possible to define custom formats alike the [morgan](https://github.com/expressjs/morgan) ones or make use of available presets. Additionally it enables to define own tokens which could be used in custom formats. *laabr* is the Swabian translation for *talking*.

This plugin is implemented in ECMAScript 6 without any transpilers like `babel`.<br>
Additionally `standard` and `ava` are used to grant a high quality implementation.

#### `laabr` vs. `hapi-pino`
First of all `laabr` extends the `hapi-pino` plugin. So it is possible to use `laabr` in an almost identical manner like `hapi-pino`. This plugin provides further features which probably decelerates the logging a bit, but it should be fast than alternatives anyway. The following features are provided:

- Context-sensitve colorization
- Customizable identation for JSON strings
- Preset [tokens](#tokens) to extract and compose data as needed
- Preset [formats](#formats) combining useful tokens for an easy start
- Possibility to add own format [presets](#presets) for an easy reuse
- Easily customizable tokens & formats

![laabr screen](https://github.com/felixheck/laabr/raw/master/assets/screen.png)

## Installation
For installation use the [Node Package Manager](https://github.com/npm/npm):
```
$ npm install --save laabr
```

or clone the repository:
```
$ git clone https://github.com/felixheck/laabr
```

Alternatively use the [Yarn Package Manager](https://yarnpkg.com):
```
$ yarn add laabr
```

## Usage
#### Import
First you have to import the module:
``` js
const laabr = require('laabr');
```

#### Create hapi server
Afterwards create your hapi server and the corresponding connection if not already done:
``` js
const server = new Hapi.Server();

server.connection({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct options:
``` js
server.register({
  register: laabr.plugin,
  options: {},
}, function(err) {
  if (err) {
    throw err;
  }
});
```

## API
#### `laabr.plugin`

**`options`**
- **colored**: `boolean`<br/>
Optional. Default: `false`<br/>
Partially colorizes token outputs with ANSI powered by [chalk](https://github.com/chalk/chalk).

- **indent**: `string | number`<br/>
Optional. Default: `2`<br/>
Take a look at the `space` argument of [JSON.stringify](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). This setting is just relevant for format strings marked as JSON.

- **stream**: `Writable`<br/>
Optional. Default: `process.stdout`<br/>
Take a look at the `stream` argument of [pino](https://github.com/pinojs/pino/blob/master/docs/API.md).

- **pino**: `Object`<br/>
Optional. Default: `{}`<br/>
[pino](https://github.com/pinojs/pino) related options. `prettyPrint`, `timestamp` and `browser` are effectless. The created instance is passed to [hapi-pino](https://github.com/pinojs/hapi-pino).

- **plugin**: `Object`<br/>
Optional. Default: `{}`<br/>
[hapi-pino](https://github.com/pinojs/hapi-pino) related options. `prettyPrint`, `mergeHapiLogData` and `instance` are effectless. Use `options.pino` to configre the passed `instance`.

#### `laabr.token(<string> name, <Function> callback)`
To define a token, simply invoke `laabr.token()` with the name and a callback function. Run `laabr.token` before registering the plugin.

**`callback(<Object> data, <Object> colors)`**
The callback function is expected to be called with the arguments `data` and `colors`. Those represent the logged data and an object containing respective [chalk](https://github.com/chalk/chalk) functions. Additionally, the token can accept further arguments of it's choosing to customize behavior. The `colors` object contains the following key: `level`, `status` and `dim`. Those represent chalk color functions related to the context, the log level and the request status code. This callback function is expected to return a string value. The value returned is then available as `:hello` in this case below:

``` js
laabr.token('hello', () => 'hello!');
```

#### `laabr.preset(<string> key, <string|false> preset)`
To define own format presets, simply invoke `laabr.preset()` with an unique key and a format string. Use your own or provided presets for an easy reuse and exchange by passing the key to `laabr.format()` instead of the format string itself. Run `laabr.format` before registering the plugin.

``` js
laabr.preset('server.env', ':time :environment :host :host[port]');
```

#### `laabr.format(<string> event, <string|false> format)`
To define a format, simply invoke `laabr.format()` with the event and a format string. Use existing tokens with `:<token>` within the format string.<br>
If the `format` is set to `false`, it logs the whole json message without any pretty-printed format. Run `laabr.format` before registering the plugin.

``` js
laabr.format('onPostStart', ':time :hello world!');
```

Furthermore it is possible to define JSON strings. Therefor enclose the template string with `({` & `})` and use an object-like structure:

``` js
laabr.format('onPostStart', '({ ts::time, msg::hello world! })');
```

Or use a format preset key instead of a format string:

``` js
laabr.format('onPostStart', 'server.env');
```

The `event` is allowed to be `onPostStart`, `onPostStop`, `response`, `request-error` and `log`. The events are analog to the [hapi-pino](https://github.com/pinojs/hapi-pino) ones.

## Tokens
The following tokens are available by default:

#### General
- `:pid` – The process identifies.
- `:level[field?]` - The logging Level. If `field` is unset, get the label. Otherwise, if `field=code`, get the level itself.
- `:time[format?]` - The current date and time in UTC. The available formats are:<br>
  - Default is the timestamp configured with `options.pino.timestamp` (`971186136`)
  - `iso` for the common ISO 8601 date time format. Just works if `options.pino.timestamp` is unset (`1970-01-12T05:46:26.136Z`)
  - `utc` for the common RFC 1123 date time format Just works if `options.pino.timestamp` is unset (`Mon, 12 Jan 1970 05:46:26 GMT`)
- `:message[field=msg]` - The `msg` or `data` field of the log. Just works with logged strings or [`server.log`](https://hapijs.com/api#serverlogtags-data-timestamp)/[`request.log`](https://hapijs.com/api#requestlogtags-data-timestamp). Otherwise pass a custom field with fallback to the `msg` and `data` fields or use the `:get[field]` token. Both alternatives expect dot notation paths.
- `:get[field]` – The value related to the given path in dot notation. Like `:message[field]` but without fallback.
- `:error[field=message]` - The `message` field of the error object. Alternatively pass a dot notation path to the token. Helpful paths are `message`, `stack`, `type`, `output`, `isServer` and `isBoom`.
- `:environment` - The `NODE_ENV` environment variable.

#### Request/Response
- `:responseTime` - The response time in milliseconds.
- `:res[header]` - The given `header` of the response.
- `:req[header]` - The given `header` of the request.
- `:status` - The status code of the request/response.
- `:method` - The http request method.
- `:payload` - The request payload. Just works with `options.plugin.logPayload = true`, it is enabled by default.
- `:remoteAddress` - The remote client IP address.
- `:remotePort` - The remote client port.
- `:url` - The parsed url of the request.

#### Host
- `:host[field?]` – Information about the host. Get the host by default. This token is just available for the `onPostStart` & `onPostStop` events. It uses the [`server.info` object](https://hapijs.com/api#serverinfo), so it just works for a single connection. The available information are:<br>
  - Default is the host name of the connection (`localhost`)
  - `port` for the connection port (`3000`)
  - `address` for the active IP address bound to the connection (`127.0.0.1`)
  - `protocol` for the used protocol (`http`)
  - `uri` for the complete host url (`http://localhost:3000`)

## Formats
The following formats/[presets](#presets) are set by default:

| Event           | Preset                             |
|----------------:|------------------------------------|
| `log`           | [`log.tinyjson`](#logtinyjson)     |
| `response`      | [`response.tiny`](#responsetiny)   |
| `request-error` | [`error.tinyjson`](#errortinyjson) |
| `onPostStart`   | [`server.info`](#serverinfo)       |
| `onPostStop`    | [`server.info`](#serverinfo)       |

## Presets
#### `log.tiny`
``` js
:time :level :message
```

*Example Output*
```
1499260782451 info foobar
```

#### `log.tinyjson`
``` js
({ message::message, timestamp::time, level::level, environment::environment })
```

*Example Output*
```
{
  "message": "foobar",
  "timestamp": 1499260782451,
  "level": "info",
  "environment": "development"
}
```

#### `response.tiny`
``` js
:time :method :remoteAddress :url :status :payload (:responseTime ms)
```

*Example Output*
```
1499255578965 GET 127.0.0.1 / 200 {} (24 ms)
```

#### `error.tiny`
``` js
:time :level :error
```

*Example Output*
```
1499260782451 info Internal Server Error
```

#### `error.tinyjson`
``` js
({ error::error, timestamp::time, level::level, environment::environment })
```

*Example Output*
```
{
  "error": "Internal Server Error",
  "timestamp": 1499260782451,
  "level": "info",
  "environment": "development"
}
```

#### `server.info`
``` js
:time :level :message at: :host[uri]
```

*Example Output*
```
1499255572003 info server stopped at http://localhost:3000
```

## Example
**Code**

``` js
const Hapi = require('hapi');
const laabr = require('laabr');

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

laabr.format('onPostStart', ':time :start :level :message')
laabr.token('start', () => '[start]')

server.route([
  {
    method: '*',
    path: '/response',
    handler (req, reply) {
      reply('hello world')
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler (req, reply) {
      reply(new Error('foobar'))
    }
  }
])

process.on('SIGINT', () => {
  server.stop().then((err) => {
    process.exit((err) ? 1 : 0)
  })
})

server.register({
  register: laabr.plugin,
  options: {
    indent: 0
  }
})
.then(() => server.start())
.catch(console.error)

server.log('info', 'did you mean "foobar"?')
```

**Output**

```
// (1) `log`
$ {"message":"did you mean \"foobar\"?","timestamp":1499352305938,"level":"info"}

// (2) `onPostStart`
$ 1499352305956 [start] info server started

// (3) `response` – calling `/response`
$ 1499352307927 GET 127.0.0.1 /response 200 {} (25 ms)

// (4) `request-error` & `response` – calling `/error`
$ {"error":"foobar","timestamp":1499352320071,"level":"warn"}
$ 1499352320072 GET 127.0.0.1 /error 500 {} (3 ms)

// (5) `onPostStop` – Pressing `Ctrl + C`
$ 1499352325077 info server stopped
```

## Developing and Testing
First you have to install all dependencies:
```
$ npm install
```

To execute all unit tests once, use:
```
$ npm test
```

or to run tests based on file watcher, use:
```
$ npm start
```

To get information about the test coverage, use:
```
$ npm run coverage
```

## Contribution
Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up the almost 100% test coverage.

## License
The MIT License

Copyright (c) 2017 Felix Heck

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
