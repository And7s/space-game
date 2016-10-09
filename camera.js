
var Camera = {
  offset: new Vector(0,0),
  speed: 0.1, //weight of the new should value

  update: function() {
    var s_x = Player.pos.x-App.size_x/2;
    if(s_x < 0) {s_x = 0;}
    var s_y = Player.pos.y-(App.size_y-100)/2;
    if(s_y < 0) {s_y = 0;}

    if(s_x > (Map.width-App.size_x)) {
      s_x = (Map.width-App.size_x);
    }
    if(s_y > Map.height-App.size_y+80) {
      s_y = Map.height-App.size_y+80;
    }
    this.offset.x = s_x*this.speed+this.offset.x*(1-this.speed);

    this.offset.y = s_y*this.speed+this.offset.y*(1-this.speed);
  }
};
