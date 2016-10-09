
var Particles = {
  particles: [],
  last_time: getTime(),

  draw: function() {
    var p, erase;
    ctx.fillStyle = '#DDDDDD';
    for(var i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      erase = false
      if(p.time < getTime()-1000) {
        this.particles[i] = this.particles[this.particles.length-1];
        this.particles.pop();
        i--;
      }else {
        ctx.beginPath();  //draw dots
        ctx.arc(p.pos.x,p.pos.y,1,0,2*Math.PI);
        ctx.fill();
      }
    }
  },

  add: function(pos) {
    if(this.last_time < getTime()-30) {
      this.particles.push({
        pos: pos,
        time: getTime()
      });
      this.last_time = getTime();
    }
  }
}