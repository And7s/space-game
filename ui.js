
//the user interface in the game, drawing 2d stuff onscreen
var Ui = {
  draw: function() {
    //draw the user interface
    ctx.drawImage(Images.ui, 0,App.size_y-103);
    if(Player.store) {
      ctx.drawImage(Images.cargo0, 20, 551);
    }

    this.drawBar(196.5,538.5,Player.life/Player.maxlife);
    this.drawBar(196.5,587.5,Player.fuel/Player.maxfuel);

    //text

    text(App.set.deliver-App.deliver, 70, 558, 8, '#FFF');
    text(App.deliver, 70, 569, 8, '#FFF');

    App.duration += time.delta;
    text(this.formatTime(App.duration), 422, 562, 16, '#FFF');

    Map.drawthumb();
  },

  formatTime: function(ms) {
    ms = ms/1000|0;
    if (ms < 10) {
      return '0  0'+ms;
    }else if(ms < 60) {
      return '0  '+ms;
    }else {
      var rem = ms%60;
      ms = Math.floor(ms/60);
      return ms+'  '+rem;
    }

    return ms;
  },
  drawBar: function(x,y,perc) {
    if(perc < 0) perc = 0;

    var grd = ctx.createLinearGradient(x,y, x+70, y);
    grd.addColorStop(0, '#F00');
    grd.addColorStop(0.5, '#FF0');
    grd.addColorStop(1, '#0F0');
    ctx.fillStyle = grd;
    ctx.fillRect(x,y, 70*perc,4);

    ctx.strokeStyle = '#000';
    ctx.beginPath();

    ctx.moveTo(x,y);
    ctx.lineTo(x+70,y);
    ctx.lineTo(x+70,y+4);
    ctx.lineTo(x,y+4);
    ctx.lineTo(x,y+2);

    ctx.lineTo(x+70,y+2);//right middle

    for(var i = 70; i >= 7; i -= 7) {
      ctx.lineTo(x+i,y+4);
      ctx.lineTo(x+i-7,y+4);
      ctx.lineTo(x+i-7,y+0);
    }

    ctx.closePath();
    ctx.stroke();
  }
}