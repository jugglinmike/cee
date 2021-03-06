require({
  baseUrl: '/bower_components',
  paths: {
    activities: '../activities',
    components: '../components',
    scripts: '../scripts',

    // Third-party libraries
    backbone: 'backbone/backbone',
    cloak: '../node_modules/cloak/cloak-client',
    d3: 'd3/d3',
    'd3.chart': 'd3.chart/d3.chart',
    highlight: 'highlightjs/highlight.pack',
    layoutmanager: 'layoutmanager/backbone.layoutmanager',
    lodash: 'lodash/dist/lodash.underscore',
    jquery: 'jquery/jquery',
    'jquery.pep': 'jquery.pep/src/jquery.pep',
    rangeslider: 'rangeslider.js/dist/rangeslider',
    'socket.io-client': 'socket.io-client/dist/socket.io',

    // AMD loader plugins
    jade: 'require-jade/jade',
    json: 'requirejs-json/json',
    text: 'jquery-mobile/external/requirejs/plugins/text'
  },
  map: {
    '*': {
      underscore: 'lodash'
    }
  },
  packages: [
    {
      location: 'when',
      name: 'when',
      main: 'when'
    },
    /**
     * The CSS loader plugin references modules using relative paths, so
     * it must be specified as an AMD package in order for r.js to
     * resolve its dependencies correctly.
     */
    {
      location: 'require-css',
      name: 'css',
      main: 'css'
    },
    {
      name: 'jquery-mobile',
      location: 'jquery-mobile'
    },
    {
      name: 'jquery-ui',
      location: 'jquery-ui/ui'
    },
    {
      name: 'jquery-plugins',
      location: 'jquery-mobile/external/jquery/plugins'
    }
  ],
  shim: {
    d3: {
      exports: 'd3',
    },
    'd3.chart': {
      deps: ['d3']
    },
    highlight: {
      exports: 'hljs'
    },
    rangeslider: {
      deps: [
        'jquery',
        'css!rangeslider.js/dist/rangeslider'
      ]
    }
  },
  deps: ['scripts/main']
});
