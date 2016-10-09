
var Animation = {
  anims: [],

  draw: function() {
    for(var i = 0; i < this.anims.length; i++) {
      var a = this.anims[i];
      if(a.last_time+100 < getTime()) {
        a.frame++;
        a.last_time = getTime();
        if(a.frame >= 12) { //Depending on type
          this.anims[i] = this.anims[this.anims.length-1];
          this.anims.pop();
          i--;
          continue;
        }

      }else {
        a.pos.add(a.vel.mulC(time.deltas));
        ctx.drawImage(Images.gunExplosion, 120*a.frame, 0, 120,120, a.pos.x-60, a.pos.y-60, 120,120);
      }
    }
  },

  add: function(obj) {  //obj = {pos, vel, type, callback}
    obj.frame = 0;
    obj.last_time = getTime();
    this.anims.push(obj);
  }
}
