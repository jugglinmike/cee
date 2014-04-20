define(function(require) {
  'use strict';

  var Collection = require('backbone').Collection;

  var PlayerModel = require('./player-model');

  var PlayerCollection = Collection.extend({
    model: PlayerModel,

    /**
     * Return an array containing the models of each active player.
     */
    active: function() {
      return this.filter(function(player) {
        return player.get('activatedRound') > -1;
      });
    },

    activeByRound: function() {
      return this.chain()
        .groupBy(function(player) {
          return player.get('activatedRound');
        })
        .toArray()
        .map(function(roundPlayers) {
          return roundPlayers.length;
        })
        .value();
    }
  });

  return PlayerCollection;
});
