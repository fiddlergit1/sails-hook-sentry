module.exports = function Sentry(sails) {
  const Sentry = require('@sentry/node')
  return {
    /**
     * Default configuration
     *
     * We do this in a function since the configuration key for
     * the hook is itself configurable, so we can't just return
     * an object.
     */
    defaults: {
      __configKey__: {
        dns: null
      }
    },

    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {
      var settings = sails.config[this.configKey];
      if (!settings.dns) {
        sails.log.error('DSN for Sentry is required.');
        return cb();
      }

      Sentry.init(settings.dns)

      sails.sentry = Sentry;

      // handles Bluebird's promises unhandled rejections
      process.on('unhandledRejection', function (reason) {
        console.error('Unhandled rejection:', reason);
        Sentry.captureException(e)
      });

      // We're done initializing.
      return cb();
    },
    sentry: Sentry
  };
};
