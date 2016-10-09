var Images; //global
var ctx;
//Load images

var debug = false;


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;


loadImages({
  menu: 'gfx/space.jpg',
  map: 'gfx/map.png',
  player: 'gfx/player.png',
  player2: 'gfx/rocket2.png',
  bar: 'gfx/bar2.png',
  cargo0: 'gfx/cargo0.png',
  gun: 'gfx/gun.png',
  explosion: 'gfx/rocket_vybuch.png',
  inanimation: 'gfx/anirocket.png',
  gunExplosion: 'gfx/striledlo_vybuch.png',
  ui: 'gfx/spodek.png',
  thumbs: 'gfx/thumbs.png',

  }, function(images) {

    Images = images;
    App.initialize();
    //Map.initialize();
    Highscore.initialize();
    Player.initialize();

    App.Loop();
});

//beschriebt welche keys
var input = {
  left: 37, //left arrow key
  right: 39,  //right arrow key
  up: 38,   //arrow up
  shoot: 32,  //space
  f5: 116,  //F5
  pause: 27 //esc
};




var glcounter = 0;



$(window).resize(function() {
  App.OnResize();
});



var log = function(s) {
  if(debug) {
    console.log(s);
  }
}
