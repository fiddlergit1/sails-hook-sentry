module.exports = function Sentry(sails) {
  const Sentry = require("@sentry/node");
  return {
    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {
      var settings = sails.config[this.configKey];
      if (!settings.active) {
        sails.log.info("Sentry hook was set to inactive in config.");
        return cb();
      }

      if (!settings.dsn) {
        sails.log.error("DSN for Sentry is required.");
        return cb();
      }

      const config = {
        dsn: settings.dsn,
      };

      if (settings?.options?.release) {
        config.release = settings.options.release;
      }

      if (settings?.options?.environment) {
        config.environment = settings.options.environment;
      }

      Sentry.init(config);
      sails.log.info(`Sentry initialized with DSN: `, settings.dsn);

      sails.sentry = Sentry;

      // handles Bluebird's promises unhandled rejections
      process.on("unhandledRejection", function (reason) {
        console.error("Unhandled rejection:", reason);
        Sentry.captureException(reason);
      });

      // We're done initializing.
      return cb();
    },
    sentry: Sentry,
  };
};
