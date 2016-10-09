

var App = {
  width: 0,
  height: 0,
  size_x: 800,
  size_y: 600,
  ratio: 8/6,
  deliver: 0,
  duration: 0,
  mobile: false,
  level: -1,


  initialize: function() {
    Highscore.logging("App.initialize");
    if(window.devicePixelRatio == 2) {
      this.mobile = true;
    }
    this.$canvasO = $('#c');
    this.canvasO = this.$canvasO[0];
    this.ctxO = this.$canvasO[0].getContext("2d");
    this.$canvas = $('<canvas>');
    this.canvas = this.$canvas[0];
    this.ctx = this.canvas.getContext("2d");
    this.progress = JSON.parse(localStorage.getItem("space_0.1_progress")) ||[];
    ctx = this.ctx;
    this.OnResize();

    this.canvas.width = this.size_x;  //hardcoded is bad, but i dont know
    this.canvas.height = this.size_y;


    InitMouse();
    Key = new Key();
    var that = this;

    Menu.initialize();

    //window.setInterval(function() {that.Loop();}, 16);

  },

  //a level is finished
  finished: function() {
    //saving to local storage that this level was accomplished
    if(!this.progress[this.level]) {
      this.progress[this.level] = Infinity;
    }
    this.progress[this.level] = Math.min(this.progress[this.level], App.duration);
    localStorage.setItem("space_0.1_progress", JSON.stringify(this.progress));

    log("finished");
    Highscore.logging("Finished Level in "+App.duration);
    Menu.state = 4;
    if(App.mobile) $('.mobile-btn').removeClass('visible');
    Highscore.showFinished();

  },

  Loop: function() {
    if(!(Menu.state == 3 || Menu.state == 4)) {
      ctx.clearRect(0, 0, this.size_x, this.size_y);
    }
    this.ctxO.clearRect(0, 0, this.width, this.height);

    if(Menu.state == 0) {

      log("draw menu");
      Menu.draw();

    }else if(Menu.state == 1) {
      //level loading

      text("Loading", 10,15);
    }else if(Menu.state == 2){

      Player.update();
      Camera.update();
      ctx.save();
      ctx.translate(-Camera.offset.x, -Camera.offset.y)
        Guns.draw();
        Map.draw();
        Shots.draw();

        Bars.draw();
        Animation.draw();
        Particles.draw();

        Player.draw();
      ctx.restore();
      Ui.draw();

      if(Key.hit(input.pause) || (maus.click >0 && maus.x < 0.1 && maus.y < 0.1)) { //goto menu
        Menu.showPause();
      }

    }else if(Menu.state == 3) {   //Pause menu
      if(Key.hit(input.pause) || (maus.click >0 && maus.x < 0.1 && maus.y < 0.1)) {
        Menu.state = 2;
        Menu.hide();
        if(App.mobile) $('.mobile-btn').addClass('visible');
      }

    }else if(Menu.state == 4) {   //Level finished

    }
    this.ctxO.drawImage(this.canvas, 0, 0, this.width, this.height);

    FPS();
    var that = this;
    maus.clear(); //under the assumption taht js is single threaded this should work

    //window.setTimeout(function() {that.Loop();}, 1);
    requestAnimationFrame(function() {App.Loop(); });
  },

  LoadLevel: function(level) {
    Highscore.logging("Load level "+level);
    log("loading map");

    this.level = level;

    var set = Settings[level];
    this.set = set;
    Bars.set(set.bars);
    Player.set(set.player);
    Map.set(set.map);
    Guns.set(set.guns);
    this.deliver = set.deliver;
    this.duration = 0;

    var that = this;
    loadImages({
      map: set.map.path
    }, function(images) {


      Images.map = images.map;
      Map.initialize();
      Menu.state = 2;
      if(App.mobile) {
        $('.mobile-btn').addClass('visible')
      }
    });

  },

  OnResize: function() {


    log("resize");
    this.width = $(window).width();
    this.height = $(window).height();

    log("height"+this.height);



    if(this.height/this.width < (1/this.ratio)) {
      log("height max");
      this.height = this.height;
      this.width = this.height*this.ratio;
    }else {
      log("width max");
      this.width = this.width;
      this.height = this.width/this.ratio;
    }
    log("set to "+this.width+" "+this.height);
    this.canvasO.width = this.width;
    this.canvasO.height = this.height;
    $('#menu').css({
      width: this.width+'px',
      height: this.height+'px'
    });

    $('html').css({
      'font-size': (this.width/1000*90)+'%'
    });
  }
};