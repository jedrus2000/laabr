const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  throw new Error('foobar')
})
