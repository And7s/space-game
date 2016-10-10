

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

    this.mobile = mobileAndTabletcheck();

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

// detectmobilebrowsers.com
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};