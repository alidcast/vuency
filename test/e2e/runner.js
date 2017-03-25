var path = require('path'),
    httpServer = require('http-server'),
    spawn = require('cross-spawn'),
    opts = process.argv.slice(2)

const server = require('../../demo/server')

if (opts.indexOf('--config') === -1) {
  opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])
}
if (opts.indexOf('--env') === -1) {
  opts = opts.concat(['--env', 'chrome'])
}

const runner = spawn('./node_modules/.bin/nightwatch', opts, {
  stdio: 'inherit'
})

runner.on('exit', function (code) {
  // server && server.close()
  process.exit(code)
})

runner.on('error', function (err) {
  // server && server.close()
  throw err
})
