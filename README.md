[![npm][npm]][npm-url]
[![node][node]][node-url]
[![npm-stats][npm-stats]][npm-url]
[![deps][deps]][deps-url]
[![travis][travis]][travis-url]
[![appveyor][appveyor]][appveyor-url]
[![coverage][coverage]][coverage-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

<h1 align="center">inspect-loader</h1>

<p align="center">Webpack loader designed for loader testing and debugging. Calls a function with the received input.</p>


<h2 align="center">Install</h2>

```bash
npm install --save-dev inspect-loader
```

<h2 align="center">Example</h2>

Put the **inspect-loader** in front of the loader you want to test and pass in a callback function. The callback function will be called with useful information about the given inputs (`arguments`). It also exposes the internal loader context for further inspection:

```js
webpack({
    ...
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "inspect-loader",
                options: {
                    callback(inspect) {
                         console.log(inspect.arguments);
                         console.log(inspect.context);
                         console.log(inspect.options);
                    }
                }
            }, {
                loader: "my-loader" // loader that you want to test/debug
            }]
        }]
    }
});
```

The loader returns the received arguments, which means that you can place the **inspect-loader** in the middle of your loader pipeline. You can even inspect multiple loaders:

```js
webpack({
    ...
            use: [{
                loader: "inspect-loader",
                options: {
                    callback: inspectALoader
                }
            }, {
                loader: "a-loader"
            }, {
                loader: "inspect-loader",
                options: {
                    callback: inspectBLoader
                }
            }, {
                loader: "b-loader"
            }]
    ...
});
```

### Raw

This package exposes also a raw version that can be used to test [raw loaders](https://webpack.js.org/api/loaders/#-raw-loader):

```js
webpack({
    ...
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "inspect-loader/raw",
                options: {
                    callback(inspect) {
                         console.log(inspect.arguments[0] instanceof Buffer); // true
                    }
                }
            }, {
                loader: "my-raw-loader" // raw loader that you want to test/debug
            }]
        }]
    }
});
```

<h2 align="center">Options</h2>

### `callback: Function | string`

Can be a `Function` (preferred) or a `string`. In case it's a string, it is treated as a string reference and will be invoked on the `inspectLoader.callbacks` object like this:

```js
const inspectLoader = require("inspect-loader");

inspectLoader.callbacks.myCallback = function () { ... };

webpack({
    ...
                loader: "inspect-loader",
                options: {
                    callback: "myCallback"
                }
    ...
});
```


The callback passes an `inspect` object as single argument that exposes the internal loader state:

```js
{
    arguments, // A true array that carries all the input arguments that were passed to the loader
    context, // A reference to the loaderContext of the inspect-loader
    options // A reference to the options object of the inspect-loader
}
```

```js
function callback(inspect) {
    console.log(inspect.arguments); // ["loader contents from the previous loader"]
    console.log(inspect.context); // { resource: "...", ... }
    console.log(inspect.options); // { callback: [Function] }
}
```

**Please note:** `context` and `options` are *not* references to the `loaderContext` of the loader you want to test. They just expose the internal state of the **inspect-loader**. This is useful if you have multiple callbacks and you want to find out which resource or loader pipeline has been invoked.

<h2 align="center">Usage</h2>

### Assertions

Most of the time, you will probably want to do assertions on the `inspect` object. It is recommended to do this *after* the webpack compilation has finished, because otherwise the assertion error will be caught by webpack and reported as `Module build error`.

Not so good:

```js
    ...
    loader: "inspect-loader",
    options: {
        callback(inspect) {
            // assertion errors will be caught as Module build error
            assert.deepEqual(inspect.arguments, [...])
        }
    }
    ...
```

Better:

```js
let args;

webpack({
    ...
    loader: "inspect-loader",
    options: {
        callback(inspect) {
            args = inspect.arguments;
        }
    }
    ...
}, (err, stats) => {
    ...
    assert.deepEqual(args, [...])
});
    
```

<h2 align="center">License</h2>
Unlicense

<h2 align="center">Sponsors</h2>

[<img src="https://assets.peerigon.com/peerigon/logo/peerigon-logo-flat-spinat.png" width="150" />](https://peerigon.com)

[npm]: https://img.shields.io/npm/v/inspect-loader.svg
[npm-stats]: https://img.shields.io/npm/dm/inspect-loader.svg
[npm-url]: https://npmjs.com/package/inspect-loader

[node]: https://img.shields.io/node/v/inspect-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/peerigon/inspect-loader.svg
[deps-url]: https://david-dm.org/peerigon/inspect-loader

[travis]: http://img.shields.io/travis/peerigon/inspect-loader.svg
[travis-url]: https://travis-ci.org/peerigon/inspect-loader

[appveyor-url]: https://ci.appveyor.com/project/jhnns/inspect-loader/branch/master
[appveyor]: https://ci.appveyor.com/api/projects/status/github/peerigon/inspect-loader?svg=true

[coverage]: https://img.shields.io/codecov/c/github/peerigon/inspect-loader.svg
[coverage-url]: https://codecov.io/gh/peerigon/inspect-loader

[chat]: https://badges.gitter.im/peerigon/webpack.svg
[chat-url]: https://gitter.im/peerigon/webpack
