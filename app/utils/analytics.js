/**
 * @module analytics
 * A set of utility functions for Google Analytics.
 */

import config from '../../config.js';

type Action = 'submit' | 'error' | 'click' | 'scroll' | 'load' | 'keypress';
const VALID_ACTIONS = ['submit', 'error', 'click', 'scroll', 'load', 'keypress'];

const GOOGLE_ANALYTICS_URL = 'https://www.google-analytics.com/analytics.js';

const GA_TRACKING_CODE = ''; //process.env.GA_TRACKING_CODE || config.analytics.google;

function loadScriptFile(src, id) {
  if (!document.getElementById(id)) {
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.id = id;
    script.src = src;
    const parent = firstScript.parentNode;
    if (parent) parent.insertBefore(script, firstScript);
  }
}

/**
 * Loads Google Analytics.
 */
export function loadGoogleAnalytics() {
  // Create ga array
  window.GoogleAnalyticsObject = 'ga';
  window.ga = window.ga || ((...args) => {
    window.ga.q = window.ga.q || [];
    window.ga.q.push(...args);
  });
  window.ga.l = 1 * new Date();

  // Asynchronously load google analytics JS
  loadScriptFile(GOOGLE_ANALYTICS_URL, 'google-analytics');

  // Initialize analytics
  window.ga('create', GA_TRACKING_CODE, 'auto');
  window.ga('require', 'displayfeatures');
  window.ga('require', 'linkid');

  // Initialize error tracking
  window.onerror = (message, source, lineno, colno) => {
    const exDescription = `"${message}" at ${source}:${lineno}:${colno}`;
    window.ga('send', 'exception', { exDescription });
  };
}

/**
 * Creates an event tracker function.
 *
 * @param {String} category The event category. This indicates what high-level section of the site
 *   the analytics event is coming from. For example, we would put "Browse Page" here for all
 *   events coming from the Browse page.
 *
 * @return {Function} An event tracker function.
 */
export function createEventTracker(
  category: string,
): Function {
  if (process.env.NODE_ENV === 'development' && !category) {
    throw Error('Please specify a category.');
  }

  /**
   * Tracks user events.
   *
   * @param {String} action The event action. This indicates what the user did to trigger
   *   this event. For example, did the user click something? Did they scroll? The action must be a
   *   part of the actions constant above.
   * @param {String} label The event label. This indicates what was the thing they
   *   performed an action on. For example, did they click on a sheet music in the Browse page?
   * @param {Boolean} [nonInteraction=false] Whether the event should be recorded as a
   *   non-interaction event. For example, is this event automatically happening? Or did a user
   *   have to actually do something to make it happen? (i.e autoplaying videos)
   */
  return function trackEvent(
    action: Action,
    label: string,
    nonInteraction: boolean = false,
  ) {
    if (process.env.NODE_ENV === 'development') {
      if (!window) {
        throw Error('Cannot call trackEvent from the server-side.');
      } else if (!label) {
        throw Error('Please specify a label.');
      } else if (VALID_ACTIONS.indexOf(action) === -1) {
        throw Error('Invalid action sent to trackEvent. Check analytics.js for valid actions.');
      }
    }

    // Send the event to Google Analytics
    window.ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      nonInteraction,
    });
  };
}

/**
 * Tracks browser page views.
 *
 * @param {Object} location The location object.
 */
export function trackPageView({
  pathname,
  search,
  hash,
  }: {
  pathname: string,
  search: string,
  hash: string,
}): void {
  if (process.env.NODE_ENV === 'development' && !window) {
    throw Error('Cannot call trackPageView from the server-side.');
  }
  window.ga('send', 'pageview', `${pathname}${search}${hash}`);
}
