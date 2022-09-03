module.exports = function Sentry(sails) {
  const Sentry = require("@sentry/node");
  return {
    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {
      const settings = sails.config[this.configKey];
      if (!settings.active) {
        sails.log.info("Sentry hook was set to inactive in config.");
        return cb();
      }
      delete settings.active;

      if (!settings.dsn) {
        sails.log.error("DSN for Sentry is required.");
        return cb();
      }

      Sentry.init(settings);
      sails.log.info(`Sentry initialized with DSN: `, settings.dsn);

      // hook sentry to the sails object
      sails.sentry = Sentry;

      // handles Bluebird's promises unhandled rejections
      process.on("unhandledRejection", function (reason) {
        console.error("Unhandled rejection:", reason);
        Sentry.captureException(reason);
      });

      return cb();
    },
    sentry: Sentry,
  };
};
