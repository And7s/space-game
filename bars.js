
var Bars = {
  bars: [],

  initialize: function() {

  },

  set: function(bars) {
    this.bars = bars;
  },

  draw: function() {
    //can i land?
    var canland = false
    if((Math.abs(Player.rotate) < 0.3 || Math.PI*2-Math.abs(Player.rotate) < 0.3) && Player.moved.y >= 0) { //10degree
      canland = true;
    }
    //log("canland "+canland);

    for(var i = 0; i < this.bars.length; i++) { //each bar
      var bar = this.bars[i];
      if(Player.pos.x+Player.size > bar.pos.x && Player.pos.x-Player.size < bar.pos.x+bar.width) {

        if(Player.pos.y+Player.size > bar.pos.y && Player.pos.y-Player.size < bar.pos.y+bar.height) {
          if(!(Player.pos.x+Player.size-Player.moved.x > bar.pos.x && Player.pos.x-Player.size-Player.moved.x < bar.pos.x+bar.width)) {
            Player.pos.x -= Player.moved.x;
            Player.vel.x *= -0.9;
            Player.life -= 20;
          }
          if(!(Player.pos.y+Player.size-Player.moved.y > bar.pos.y && Player.pos.y-Player.size-Player.moved.y < bar.pos.y+bar.height)) {
            if(canland) {
              Player.pos.y = bar.pos.y-Player.size;
              Player.vel.mul(0);
              Player.rotate = 0;
              this.handle(i);
              //console.log("to "+(bar.pos.y-Player.size)+" vel "+Player.vel.y);
            }else {
              log("reflect");
              Player.life -= 20;
              Player.pos.y -= Player.moved.y;
              Player.vel.y *= -0.9;
            }
          }
        }
      }
    }

    for(var i = 0; i < this.bars.length; i++) {
      var bar = this.bars[i]

      this.drawBar(bar.pos, bar.width, bar.type);

      for(var j = 0; j < bar.store; j++) {
        ctx.drawImage(Images.cargo0, bar.pos.x+10+22*j, bar.pos.y-17)
      }
    }
  },

  drawBar: function(pos, width, type) {
    var img = Images.bar;
    var offset_y = type*11;

    var l = 24;
    var count = Math.floor(width/l);


    for(var i = 0; i < count; i++) {
      ctx.drawImage(img,
        0, offset_y,
        l, 11,
        pos.x+l*i+2, pos.y+2,
        l, 11
      );
    }
    var cutoff = width-count*l;
    if(cutoff > 0) {

      ctx.drawImage(img,
        0, offset_y,
        cutoff, 11,
        pos.x+l*count+2, pos.y+2,
        cutoff, 11
      );
    }

    ctx.beginPath();
        ctx.rect(pos.x+0.5, pos.y+0.5, width+2, 13);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111';
        ctx.stroke();


  },


  handle: function(index) {
    var bar = this.bars[index];
    if(bar.type == 2) {   //refuel
      Player.fuel += time.deltas/5;
      if(Player.fuel > Player.maxfuel) {
        Player.fuel = Player.maxfuel;
      }
    }

    if(bar.type == 0) {   //base
      Player.life = Math.min(Player.life+time.deltas/5, Player.maxlife);
      if(Player.store) {
        App.deliver--;
        Player.store = false;
        if(App.deliver <= 0) {
          App.finished();
        }
      }
    }

    if(bar.store > 0) {
      if(!Player.store) {
        bar.store--;
        Player.store = true;
        Player.storefrom = index;
      }
    }
  }
};
