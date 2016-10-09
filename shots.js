
var Shots = {
  shots: [],

  add: function(pos, vel) {
    this.shots.push({pos: pos, vel: vel});
  },

  draw: function() {

    var s;

    for(var i = 0; i < this.shots.length; i++) {

      s = this.shots[i];
      var erase = false;
      s.pos.add(s.vel.mulC(time.deltas));

      if(s.pos.x < 0 || s.pos.y < 0 || s.pos.x > Map.width ||s.pos.y > Map.height) {  //limitations to map field
        erase = true;
      }else {
        if(Map.mask[Math.round(s.pos.x)+Math.round(s.pos.y)*Map.width] == 1) {
          Map.remove(s.pos.x, s.pos.y, 10);
          erase = true;
        }else {
          ctx.beginPath();  //draw dots
          ctx.arc(s.pos.x,s.pos.y,1,0,2*Math.PI);
          ctx.fill();
        }
      }

      if(erase) {
        this.shots[i] = this.shots[this.shots.length-1];
        this.shots.pop();
        i--;
      }

    }
  }
};


var Guns = {
  guns: [ ],
  last_shot: getTime(),
  shots: [],

  set: function(guns) {
    this.guns = guns;
  },

  draw: function() {
    //spawn new shots
    if(this.last_shot+100 < getTime()) {
      for(var i = 0; i < this.guns.length; i++) {
        var g = this.guns[i];
        this.shots.push({
          pos: g.pos.clone(),
          vel: new Vector(Math.sin(g.rotate), -Math.cos(g.rotate)).mulC(3)
        });
      }
      this.last_shot = getTime();
    }



    //Draw the shots

    ctx.fillStyle = '#DD0';
    for(var i = 0; i < this.shots.length; i++) {
      var s = this.shots[i];
      var erase = false;
      s.pos.add(s.vel.mulC(time.deltas));

      if(Map.mask[Math.round(s.pos.x)+Math.round(s.pos.y)*Map.width] == 1) {

        erase = true;
      }else {

        ctx.beginPath();  //draw dots
        ctx.arc(s.pos.x-1,s.pos.y-1,1,0,2*Math.PI);
        ctx.fill();

        //Collide with player
        var dist = Player.pos.distSq(s.pos);

        if(dist < 50) { //10^2 = Player.size*Player.size
          Player.getsShot();
          erase = true;
        }
      }

      if(erase) {
        this.shots[i] = this.shots[this.shots.length-1];
        this.shots.pop();
        i--;
      }
    }

    //Draw the guns
    for(var i = 0; i < this.guns.length; i++) {

      ctx.save();
      ctx.translate( this.guns[i].pos.x, this.guns[i].pos.y)
      ctx.rotate(this.guns[i].rotate)
      ctx.drawImage(Images.gun,-17,-16 );
      ctx.restore();
    }

    //Collision with player shots


    for(var i = 0; i < this.guns.length; i++) {

      for(var j = 0; j < Shots.shots.length; j++) {
        var dist = this.guns[i].pos.distSq(Shots.shots[j].pos); // error
        if(dist < 225 ) { //15*15
          Shots.shots[j] = Shots.shots[Shots.shots.length-1];
          Shots.shots.pop();

          Animation.add({pos: this.guns[i].pos.clone(), vel: new Vector(0,0)});

          this.guns[i] = this.guns[this.guns.length-1];
          this.guns.pop();

          log("remove");
          log(Shots.shots);
          log(this.guns);

          //needs to jump to next gun, as collisions with this gun are no longer possible
          j = Shots.shots.length;
          i--;  //sill, as i is currently already the next i
        }
      }
    }
  }
}