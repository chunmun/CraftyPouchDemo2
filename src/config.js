Game.config = (function() {
  var config = {
    map: {
      width: 48,
      height: 32,
      // width: 5,
      // height: 5
    },

    tile: {
      width: 16,
      height: 16,
    },
  };

  config.canvasWidth = config.map.width * config.tile.width;
  config.canvasHeight = config.map.height * config.tile.height;

  return config;
})();