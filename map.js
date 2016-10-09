


var myData;
var Map = {

  initialize: function() {
    this.width = Images.map.width;
    this.height = Images.map.height;

    this.mask = new Uint8Array(this.width*this.height);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');

    this.context.drawImage(Images.map, 0, 0 );
    this.context.fillStyle = "#F00";
    this.context.strokeStyle = '#0F0';

    this.context.globalCompositeOperation = "destination-out";

    myData = this.context.getImageData(0, 0, this.width, this.height);

    for(var i = 0; i < this.width*this.height; i++) {
      if(myData.data[i*4+3] > 128) {
        this.mask[i] = 1;
      }
    }

  },

  set: function(opts) {
    for(var it in opts) {
      this[it] = opts[it];
    }

    var radsq = this.radius*this.radius*4;  //radius squared
    this.shotmask = new Uint8Array(radsq);

    var c = 0;

    for(var i = -this.radius; i < this.radius; i++) {
      for(var j = -this.radius; j < this.radius; j++) {
        if(i*i+j*j <= radsq) {
          this.shotmask[c++] = 1;
        }else {
          this.shotmask[c++] = 0;
        }
      }
    }
  },

  remove: function(x, y, r) {

    x = Math.round(x);
    y = Math.round(y);

    this.context.beginPath();
    this.context.arc(x, y, this.radius, 0, 2*Math.PI);
    this.context.fill();

    //update mask
    var r =  this.radius;
    var dist = r*r;
    var index = x+y*this.width;
    var ox= x;
    var oy =y;
    for(var y = -r; y < r; y++) {
      for(var x = -r; x < r; x++) {
        if(this.shotmask[(y+r)*2*r+x+r] == 1) {
          this.mask[index+x+y*this.width] = 0;
        }
      }
    }
  },

  draw: function() {
    ctx.drawImage(this.canvas, 0,0 );
  },

  drawthumb: function() {
    //TODO get rid of the constants, implmment filters, add dot and performance improvement
    //TODO: propably slow: replace with prerendered image
    //ctx.drawImage(this.canvas, App.size_x*0.645, App.size_y*0.88, App.size_x*0.11, App.size_y*0.11);
  }
};