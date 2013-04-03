
/**
 * Loading Scene in the Game
 */
Crafty.scene('Loading', function() {
  console.log('Start Loading');
  var loadingText = Crafty.e("2D, DOM, Text")
      .attr({w: 500, h: 20, x: ((Crafty.viewport.width) / 2), y: (Crafty.viewport.height / 2), z: 2})
      .text('Loading ...')
      .textColor('#000')
      .textFont({'size' : '24px', 'family': 'Arial'});

  // var assets = [];

  // Crafty.load(assets, function() {
  //   console.log('Game Assets Loaded');
  // });
  Crafty.scene('StartSplash');
}, function() {

});



/**
 * Start Splash Scene
 */

var blackFun;
Crafty.scene('StartSplash', function() {
  var StartText = Crafty.e("2D, Canvas, Text")
      .attr({
        w: 100,
        h: 20,
        x: (Crafty.viewport.width / 3),
        // x: 20,
        y: (Crafty.viewport.height / 2),
        z: 2
      })
      .text('Press any key to start game')
      .textColor('rgb(0,0,0)')
      .textFont({'size' : '24px', 'family': 'Arial'});

  var blackout = Crafty.e('Blackout');
  blackFun = function() {
    Crafty.trigger('blackOut');
  };

  Crafty.bind('KeyDown', blackFun);
}, function() {
  Crafty.unbind('KeyDown', blackFun);
});

/**
 * Start Menu Scene
 * - Menu to start new game or load saved games
 */
Crafty.scene('StartMenu', function() {

  // TODO: Implement Start menu
  console.log('In StartMenu');
  Crafty.scene('GameMain');

}, function() {

});





var gameMap;
var origMap;
var stateMap;
var nextMap;

var loadStateMap = function() {
  for (var x = 0; x < Game.config.map.width; x++) {
    for (var y = 0; y < Game.config.map.height; y++) {
      switch (stateMap[x][y]) {
        case 0:
          gameMap[x][y].setMode(false);
        break;
        case 1:
          gameMap[x][y].setMode(true);
        break;
      }
    }
  }
}

// Clones from src to dest
var cloneMap = function(src) {
  var arr = [];
  for (var i = 0; i < src.length; i++) {
    arr[i] = src[i].slice(0);
  }
  return arr;
}

var generateMap = function() {
  if (origMap !== undefined) return;
  // A 2D array to keep track of all occupied tiles
  origMap = [];
  gameMap = [];
  stateMap = [];
  nextMap = [];
  for (var x = 0; x < Game.config.map.width; x++) {
    origMap[x] = [];
    gameMap[x] = [];
    stateMap[x] = [];
    nextMap[x] = [];
    for (var y = 0; y < Game.config.map.height; y++) {
      origMap[x][y] = 0;
      stateMap[x][y] = 0;
      nextMap[x][y] = 0;
      gameMap[x][y] = Crafty.e('Tile').at(x,y).setMode(false);
    }
  }
}

var advanceState = function() {
  for (var x = 0; x < Game.config.map.width; x++) {
    for (var y = 0; y < Game.config.map.height; y++) {
      var alive = getNeighboursAlive(x,y);
      if(stateMap[x][y] === 1) {
        if (alive === 3 || alive === 2) {
          nextMap[x][y] = 1;
        } else {
          nextMap[x][y] = 0;
        }
      } else {
        if (alive === 3) {
          nextMap[x][y] = 1;
        } else {
          nextMap[x][y] = 0;
        }
      }
    }
  }
  stateMap = cloneMap(nextMap);
}

var getNeighboursAlive = function(x, y) {
  if (x == 0) {
    if (y == 0) { // Top left
      // console.log('top left');
      return stateMap[x+1][y]+stateMap[x][y+1]+stateMap[x+1][y+1];
    } else if (y == Game.config.map.height - 1) { // Bot left
      // console.log('bot left');
      return stateMap[x+1][y]+stateMap[x][y-1]+stateMap[x+1][y-1];
    } else { // Left
      // console.log('left');
      return stateMap[x][y-1]+stateMap[x+1][y-1]+
             stateMap[x+1][y]+
             stateMap[x][y+1]+stateMap[x+1][y+1];
    }
  } else if (x == Game.config.map.width - 1) {
    if (y == 0) { // Top Right
      // console.log('top right');
      return stateMap[x-1][y]+stateMap[x][y+1]+stateMap[x-1][y+1];
    } else if (y == Game.config.map.height - 1) { // Bot Right
      // console.log('bot right');
      return stateMap[x-1][y]+stateMap[x][y-1]+stateMap[x-1][y-1];
    } else { // Right
      // console.log('right');
      return stateMap[x-1][y-1]+stateMap[x][y-1]+
             stateMap[x-1][y]+
             stateMap[x-1][y+1]+stateMap[x][y+1];
    }
  } else {
    if (y == 0) { //Top
      // console.log('top');
      return stateMap[x-1][y]+stateMap[x+1][y]+
             stateMap[x-1][y+1]+stateMap[x][y+1]+stateMap[x+1][y+1];
    } else if (y == Game.config.map.height - 1) { // Bot
      // console.log('bot');
      return stateMap[x-1][y-1]+stateMap[x][y-1]+stateMap[x+1][y-1]+
             stateMap[x-1][y]+stateMap[x+1][y];
    } else {  // Inner tiles
      // console.log('inner');
      return stateMap[x-1][y-1]+stateMap[x][y-1]+stateMap[x+1][y-1]+
             stateMap[x-1][y]+stateMap[x+1][y]+
             stateMap[x-1][y+1]+stateMap[x][y+1]+stateMap[x+1][y+1];
    }
  }
}

/**
 * The actual game scene
 */
Crafty.scene('GameMain', function() {
  var modes = {RUNNING:'RUNNING', SAVING:'SAVING'};
  var currMode = modes.RUNNING;
  generateMap();
  loadStateMap();

  Crafty.background('rgb(100,100,100)');
  var stepGameMap = function() {
    advanceState();
    loadStateMap();
  }

  this.bind('tileClick', function(pos) {
    // console.log('clicking at '+pos.x+','+pos.y+' to set '+pos.mode);
    stateMap[pos.x][pos.y] = (pos.mode ? 1 : 0);
  })

  // this.controller = Crafty.e('Controller');
  this._enterFrame = this.bind('EnterFrame', function() {
    if (Crafty.keydown[Crafty.keys['SPACE']]) {
      stepGameMap();
    }
  });

  var saveBox = Crafty.e('Box, SaveMenuBindings');
  var saveText = Crafty.e('Textfield, SaveMenuBindings');

  var loadBox = Crafty.e('Box, LoadMenuBindings');
  var loadText = Crafty.e('Textfield, LoadMenuBindings');

  this.saveLoad = this.bind('KeyDown', function(e) {
    var _this = this;
    if (currMode === modes.RUNNING) {
      switch (e.keyCode) {
        case 79: // 'o'
          // Save the map
          Crafty.storage.save('map', 'save', stateMap);
          break;
        case 80: // 'p'
          var _this = this;
          // Load the map
          Crafty.storage.load('map', 'save', function(data) {
            stateMap = cloneMap(data);
            origMap = cloneMap(data);
            loadStateMap();
          });
          break;
        case 77: // 'm'
          break;
        case Crafty.keys['RIGHT_ARROW']:
        case 32: // 'Space'
          stepGameMap();
          break;
        case 82: // 'r'
          stateMap = cloneMap(origMap);
          loadStateMap();
          break;

        // Saving mode
        case Crafty.keys['K']:
          Crafty.trigger('closeLoad');
          currMode = modes.SAVING;
          Crafty.storage.getAllKeys('save', function(keys) {
            Crafty.trigger('viewSave');
          });
          break;

        // Loading mode
        case Crafty.keys['L']:
          Crafty.trigger('closeSave');
          currMode = modes.LOADING;
          Crafty.storage.getAllKeys('save', function(keys) {
            Crafty.trigger('viewLoad');
          });
          break;
      }
    }

    switch (e.keyCode) {

      case Crafty.keys['ESC']:
        currMode = modes.RUNNING;
        Crafty.trigger('closeSave');
        Crafty.trigger('closeLoad');
        break;

      case Crafty.keys['ENTER']:
        if(currMode === modes.SAVING) {
          Crafty.trigger('closeSave');
          currMode = modes.RUNNING;
          loadStateMap();
          Crafty.storage.save(saveText.getWord(), 'save', stateMap);
        } else if (currMode === modes.LOADING) {
          Crafty.trigger('closeLoad');
          Crafty.storage.load(loadText.getWord(), 'save', function(data) {
            stateMap = cloneMap(data);
            origMap = cloneMap(data);
            loadStateMap();
            currMode = modes.RUNNING;
          });
        }
        break;
    }
  });

  console.log('Game Scene done');
}, function() {
});
