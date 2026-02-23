// Analytics Abstraction Layer — provider-agnostic event tracking
// To swap providers, change the SDK script tag in base.mjs and the Analytics.init() call.
// All trackEvent/trackPageView calls in main.js remain unchanged.

(function () {
  'use strict';

  // --- Mixpanel Provider ---
  // The Mixpanel SDK snippet in base.mjs handles initialization (token, autocapture, session recording).
  // This provider just bridges the abstraction layer to the global mixpanel object.
  var MixpanelProvider = {
    init: function () {},
    trackPageView: function (properties) {
      if (typeof mixpanel !== 'undefined') {
        mixpanel.track('Page View', properties);
      }
    },
    trackEvent: function (name, properties) {
      if (typeof mixpanel !== 'undefined') {
        mixpanel.track(name, properties);
      }
    },
    identify: function (userId, traits) {
      if (typeof mixpanel !== 'undefined') {
        mixpanel.identify(userId);
        if (traits) {
          mixpanel.people.set(traits);
        }
      }
    }
  };

  // --- Provider Registry ---
  var providers = {
    mixpanel: MixpanelProvider
  };

  var activeProvider = null;

  // --- Public API ---
  window.Analytics = {
    init: function (providerName, config) {
      activeProvider = providers[providerName] || null;
      if (activeProvider) {
        activeProvider.init(config);
      }
    },

    trackPageView: function (properties) {
      if (!activeProvider) return;
      var defaults = {
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer || '(direct)',
        url: window.location.href
      };
      activeProvider.trackPageView(_merge(defaults, properties || {}));
    },

    trackEvent: function (name, properties) {
      if (!activeProvider) return;
      activeProvider.trackEvent(name, properties || {});
    },

    identify: function (userId, traits) {
      if (!activeProvider) return;
      activeProvider.identify(userId, traits);
    },

    registerProvider: function (name, provider) {
      providers[name] = provider;
    }
  };

  // --- Utility ---
  function _merge(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  }
})();
