import { App, ref } from 'vue';
import json2mq from 'json2mq';

const DEFAULT_BREAKPOINTS = {
  xs: {
    maxWidth: 600,
  },
  sm: {
    minWidth: 601,
    maxWidth: 1200,
  },
  lg: {
    minWidth: 1201,
  },
};

export interface VueMqTopDownConfig {
  breakpoints?: Record<string, json2mq.QueryObject>;
  defaultBreakpoint?: string;
  $window?: Window;
}

/**
 * Converts breakpoints to media queries using `json2mq`
 * @param breakpoints The breakpoints passed into the plugin
 * @returns A map of viewport sizes to media queries
 */
function convertBreakpointsToMediaQueries(
  breakpoints: Record<string, json2mq.QueryObject>
): Record<string, string> {
  const keys = Object.keys(breakpoints);
  const values = keys.map((key) => breakpoints[key]);
  const media: Record<string, string> = values.reduce(
    (queries: Record<string, string>, value, index) => {
      let builtQuery = '';
      builtQuery = json2mq(value);
      return Object.assign(queries, {
        [keys[index]]: builtQuery,
      });
    },
    {}
  );
  return media;
}

/**
 * Adds a function to be called when a media query matches.
 * @param {string} mediaQuery The media query to match.
 * @param {function} callback The callback to be executed with a boolean representing whether it is matched or not.
 */
function subscribeToMediaQuery(
  mediaQuery: string,
  callback: ({ matches }: { matches: boolean }) => void,
  $window: Window
) {
  const mediaQueryListener = $window.matchMedia(mediaQuery);
  mediaQueryListener.addEventListener('change', callback);

  // Call once at the start
  callback(mediaQueryListener);
}

export default {
  install: (
    app: App<Element>,
    {
      breakpoints = DEFAULT_BREAKPOINTS,
      defaultBreakpoint = 'lg',
      $window = window,
    } = {} as VueMqTopDownConfig
  ) => {
    let hasSetupListeners = false;
    const currentBreakpoint = ref(defaultBreakpoint);
    const breaks = ref(
      Object.keys(breakpoints).reduce((final, key) => {
        return Object.assign(final, {
          [key]: key === defaultBreakpoint,
        });
      }, {}) as { [key: string]: boolean }
    );
    app.mixin({
      computed: {
        $mq() {
          return currentBreakpoint.value;
        },
        $mqs() {
          return breaks.value;
        },
      },
      // Set up listeners on first time mounted.
      mounted() {
        if (!hasSetupListeners) {
          const mediaQueries = convertBreakpointsToMediaQueries(breakpoints);
          // We really need the matchMedia api; if it doesn't exist, don't set up anything
          if (!$window.matchMedia) {
            breaks.value[defaultBreakpoint] = false;
            currentBreakpoint.value = '';
          } else {
            for (const key of Object.keys(mediaQueries)) {
              const query = mediaQueries[key];
              subscribeToMediaQuery(
                query,
                ({ matches }: { matches: boolean }) => {
                  if (matches) {
                    currentBreakpoint.value = key;
                  }
                  breaks.value[key] = matches;
                },
                $window
              );
            }
          }
          hasSetupListeners = true;
        }
      },
    });
  },
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $mq: string;
    $mqs: Record<string, boolean>;
  }
}
