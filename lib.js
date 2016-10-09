//Lib


//lädt alle bilder und ruft dann eine callback methode auf


function loadImages(sources, callback) {
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {

      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}


var time = {
  now: (new Date).getTime(),
  delta: 0,
  second: (new Date).getTime(),
  curfps: 0,
  deltas: 0,
  fps: 0,

};
function FPS(){
  var now = (new Date).getTime();
  time.delta = now-time.now;
  time.deltas = time.delta/16;  //anteil eines frames
  if(time.second+1000 <= now){
    time.fps = time.curfps;
    time.curfps = 0;
    time.second = now;
    //console.log("FPS: "+time.fps);
  }

  time.curfps++;
  time.now = now;

  if(time.deltas > 5) {
    time.deltas = 5;
    console.log("idling");
  }
}


function text(text, x,y, size, color){

  size = size || 16;
  color = color || '#AAA';
  ctx.fillStyle = color;
  //ctx.font = 'thin 16px Arial serif';
  ctx.font= '400 '+size+"px Open Sans";
  ctx.textBaseline = 'bottom';
  ctx.fillText(text, x, y);

}




var Key = function() {
  var down = new Array(256);
  var hit = new Array(256);

  this.initialize = function() {
    var that = this;
    $(document).keydown(function(e) { that.keydown(e);});
    $(document).keyup(function(e) { that.keyup(e);});


  };

  this.reset = function(code) {
    hit[code] = false;
    down[code] = false;
  };

  this.simulate = function(code) {
    this.keydown({charCode: code});
  };

  this.keydown = function(e) {

    var code = e.charCode || e.keyCode;
    code = Math.min(code, 256);
    if(!down[code]) {
      hit[code] = true;
    }else {
      hit[code] = false;
    }
    down[code] = true;
  };

  this.keyup = function(e) {
    var code = e.charCode || e.keyCode;
    code = Math.min(code, 256);
    hit[code] = false;
    down[code] = false;
  };

  this.hit = function(code) {
    var ret = hit[code];
    hit[code] = false;
    return ret;
  };

  this.down = function(code) {
    return down[code];
  };


  this.initialize();
};

var maus = {
  x: 0,
  y: 0,
  click: 0,

  clear: function() {
    this.click = 0;
  }
};
var touches = [];
function InitMouse() {
  $(document).mousedown(function() {
    maus.click++;
  });

  $(document).mousemove(function(e) {

    maus.x = e.pageX/App.width;
    maus.y = e.pageY/App.height;
    //console.log(maus);
  });

  document.addEventListener('touchstart', function(e) {
      //e.preventDefault();
      touches = e.touches;
      console.log(touches[0]);

      maus.x = touches[0].pageX/App.width;
    maus.y = touches[0].pageY/App.height;
  }, false);
  document.addEventListener('touchmove', function(e) {
      //e.preventDefault();
      touches = e.touches;

  }, false);
  document.addEventListener('touchend', function(e) {
      //e.preventDefault();
      touches = e.touches;
      maus.click++;
  }, false);
  document.addEventListener('touchcancel', function(e) {
      //e.preventDefault();
      touches = e.touches;
  }, false);


}


var Vector = function(x, y) {
  this.x = x;
  this.y = y;

  this.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  this.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  };

  this.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
  };

  this.mulC = function(s) {
    return this.copy().mul(s);
  };

  this.copy = function() {
    return new Vector(this.x, this.y);
  };

  this.clone = function() {
    return new Vector(this.x, this.y);
  };

  this.distSq = function(v) {
    return (this.x-v.x)*(this.x-v.x) + (this.y-v.y)*(this.y-v.y);
  };

};

function getTime() {
  return time.now;  //caching
  //return (new Date()).getTime();
}



/*
var Arr = function(self) {
  var arr = [];
  var erased = 0;

  var that = self;
  if(self == null) {
    console.error("new Arr needs this");
  }


  this.each = function(callback) {
    console.log("each");
    if(erased) {
      this.clean();
    }
    for(var i = 0; i < arr.length; i++) {
      if(callback.length == 1) {
        callback(arr[i]);
      }else {
        callback(i, arr[i]);
      }
    }
  }

  this.erase = function(index) {
    if(arr[index] != null) {
      erased++;
      arr[index] = null;
    }
  };

  this.clean = function() {
    for(var i = 0; i < arr.length && erased > 0; i++) {
      while(arr[i] == null && erased > 0) {
        erased--;
        arr[i] = arr[arr.length-1];
        arr.pop();
      }
    }
    console.log("cleaned");
  };

  this.length = function() {
    return arr.length;
  };

  this.push = function(o) {
    arr.push(o);
  };


};*/

