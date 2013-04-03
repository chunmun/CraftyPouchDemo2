Crafty.c('MenuButton', {
  init: function() {
    this.requires('2D, Canvas, Text, Tween')
      .attr({
        x:20,
        y:20,
        w:80,
        h:20,
        alpha:0,
      })
      .text('MENU')
      .textColor('#FFFFFF')
      .textFont({'size' : '24px', 'family': 'Arial'})
      .bind('toggleMenu', function(menuOn) {
        this.menuOn = menuOn;
        var newAlpha = 0;
        if(menuOn) {
          newAlpha = 1;
        }
        console.log(newAlpha);
        this.tween({alpha: newAlpha},5);
      });
  },
});

Crafty.c('Tile', {
  init: function() {
    this.onColor = 'rgb(255,255,0)';
    this.offColor = 'rgb(0,0,0)';
    this.isOn = false;

    this.requires('2D, Canvas, Color, Grid, Tween, Mouse')
      .color(this.offColor)
      .bind('Click', function() {
        this.setMode(!this.isOn);
        var pos = this.at();
        pos.mode = this.isOn;
        Crafty.trigger('tileClick', pos);
      })
      .bind('MouseOver', function(m) {
        if (m.button !== 2) {
          // console.log(m);
        }
      });
  },

  setMode: function(isOn) {
    this.isOn = isOn;
    if (this.isOn) {
      this.color(this.onColor);
    } else {
      this.color(this.offColor);
    }
    return this;
  },

  getStatus: function() {
    return this.isOn;
  }
});

Crafty.c('Textfield', {
  init: function() {
    this._word = '';
    this._limit = 10;

    this.bind('KeyDown', function(e) {
          if(this.isOn) {
            if(e.keyCode >= 48 && e.keyCode <= 90) { //Alphanumeric keys
              for(var i in Crafty.keys) {
                if (Crafty.keys[i] === e.keyCode) {
                  this._word += i
                  this.drawWord();
                  break;
                }
              }
            } else if (e.keyCode === Crafty.keys['BACKSPACE']) {
              this._word = this._word.slice(0,-1);
              this.drawWord();
            }
          }
        })
        .bind('viewSave', function() {
          this._word=''
          this.drawWord();
        })
        .bind('closeSave', function() {
          this.destroyWord();
        })
        .bind('viewLoad', function() {
          this._word=''
          this.drawWord();
        })
        .bind('closeLoad', function() {
          this.destroyWord();
        });

    this.drawWord();
  },

  limit: function(limit) {
    this._limit = limit;
  },

  setWord: function(word) {
    this._word = word;
    this.drawWord();
  },

  getWord: function(word) {
    return this._word;
  },

  drawWord: function() {
    this.destroyWord();
    var shown = 0;
    if (this._word.length > this._limit) {
      shown = this._word.length - this._limit;
    }

    this._txt = Crafty.e('2D, Canvas, Text')
                      .text(this._word.slice(shown))
                      .textColor('#FFFFFF',1)
                      .textFont({'size' : '24px', 'family': 'Arial'});

    this._txt.attr({x: Game.config.canvasWidth/2,
                    y: Game.config.canvasHeight/2 - 22,
                    w: this._word.length * 24,
                    h: 24
                    });
    console.log(this._txt);
  },

  destroyWord: function() {
    if (this._txt !== undefined) {
      this._txt.destroy();
    }
  }
})

Crafty.c('SaveMenuBindings', {
  init: function() {
    this.isOn = false;
    this.requires('Tween')
        .bind('viewSave', function() {
          this.isOn = true;
          this.tween({alpha:1},5);
          console.log('Viewing');
        })
        .bind('closeSave', function() {
          this.isOn = false
          this.tween({alpha:0},5);
        });
  },
  }
);

Crafty.c('LoadMenuBindings', {
  init: function() {
    this.isOn = false;
    this.requires('Tween')
        .bind('viewLoad', function() {
          this.tween({alpha:1},5);
          this.isOn = true;
        })
        .bind('closeLoad', function() {
          this.isOn = false
          this.tween({alpha:0},5);
        });
  },
  }
);


Crafty.c('Box', {
  init: function() {
    this.requires('2D, Canvas, Color, SaveMenuBindings')
        .attr({
          x: 0,
          y: Game.config.canvasHeight/2-20,
          w: Game.config.canvasWidth,
          h: 25,
          alpha: 0
        })
        .color('rgb(100,100,0)');
  },
});

Crafty.c('Controller', {
  init: function() {
    this.requires('Keyboard');
  }
})

Crafty.c('Blackout', {
  init: function() {
    this.requires('2D, Canvas, Color, Tween')
      .attr({
        x: 0,
        y: 0,
        w: Crafty.viewport.width,
        h: Crafty.viewport.height,
        alpha: 0.0,
      })
      .color('rgb(0,0,0)')
      .bind('blackOut', function() {
        this.tween({alpha:1.0},20)
            .bind('TweenEnd', function() {
              this.destroy();
              Crafty.scene('StartMenu');
            });
      });
  },
});

Crafty.c('Menu', {
  init: function() {
    this.requires('2D, Canvas, Color, Tween')
      .attr({
        x: 0,
        y: 0,
        h: Game.config.canvasHeight,
        w: Game.config.canvasWidth/4,
        alpha: 0,
      })
      .color('rgb(0,0,0)')
      .bind('toggleMenu', function(menuOn) {
        var newAlpha = 0;
        if(menuOn) {
          newAlpha = 0.8;
        }
        this.menuOn = menuOn;
        this.tween({
          alpha: newAlpha,
        }, 10);
      });

      console.log('Created Menu');
  },

  setOptions: function(arr){

  }

});

// The Grid component allows an element to be located
// on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.config.tile.width - 1,
      h: Game.config.tile.height - 1
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return {
        x: this.x / Game.config.tile.width,
        y: this.y / Game.config.tile.height
      };
    } else {
      this.attr({
        x: x * Game.config.tile.width,
        y: y * Game.config.tile.height
      });
      return this;
    }
  }
});

Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid')
  }
})
