/* global chai */

var chaiAsPromised = require('chai-as-promised'),
    testsContext = require.context('./specs', true, /\.spec$/),
    srcContext = require.context('../../src', true, /^\.\/(?!index(\.js)?$)/)

chai.use(chaiAsPromised)

// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
testsContext.keys().forEach(testsContext)

// require all src files except index.js for coverage.
srcContext.keys().forEach(srcContext)
