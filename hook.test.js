const Sails = require('sails')

describe('Asserts that sentry reworked hook works well', function () {
  let sails;

  before(function (done) {
    this.timeout(0)

    Sails.lift({
      hooks: {
        "sentryd": require('./index'),
        "grunt": false
      },
      log: {
        level: "error"
      }
    }, function (err, _sails) {
      if (err) {
        return done(err)
      }
      sails = _sails;
      return done()
    })
  })

  after(function (done) {
    if (sails) {
      return sails.lower(done)
    }
    return done()
  })

  it("Should assert sails doesnt crash", function () {
    console.log(sails.hooks.sentryd)
    return true
  })
})