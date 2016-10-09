var Player = {
  pos: new Vector(150,170),
  vel: new Vector(0, 0),
  last_shot: getTime(),
  size: 10, //width/2
  rotate: 0,
  fuel: 100,
  store: false,
  maxlife: 100,
  maxfuel: 100,
  spawnpos: new Vector(0,0),
  life: 100,
  status: 0,  // 0 animate in, 1: flying, 2: dying
  last_animation: 0,
  last_show: 0,
  frame: 0,
  moved: new Vector(0,0),
  is_accelerating: false,
  gravity: 0.1,
  storefrom: null,
  accel: 0.002,

  initialize: function() {

  },

  set: function(opts) {
    for(var it in opts) {
      this[it] = opts[it];
    }
    this.spawn();
  },

  alive: function() {
    this.vel.mul(0);
    this.rotate = 0;
    this.status = 1;
  },

  dying: function() {
    this.status = 2;
    if(this.store) {
      this.store = false;
      Bars.bars[this.storefrom].store++;
    }
    this.last_animation = getTime();
    this.frame = 0;
  },

  spawn: function() {
    this.life = this.maxlife;
    this.fuel = this.maxfuel;
    this.store = false;
    this.pos = this.spawnpos.clone(),
    this.status = 0;
    this.last_animation = getTime();
    this.frame = 0;
  },

  draw: function() {
    if(this.status == 0) {
      ctx.drawImage(Images.inanimation, 110*this.frame,0, 110,110, this.pos.x-54, this.pos.y-52, 110, 110);

    } else if(this.status == 1){
      ctx.save();
      ctx.translate( this.pos.x, this.pos.y)
      ctx.rotate(this.rotate)
      ctx.drawImage((this.is_accelerating) ? Images.player2 : Images.player,-this.size,-this.size );
      ctx.restore();
    }else if(this.status == 2) {

      ctx.drawImage(Images.explosion, 20*this.frame,0, 20,20, this.pos.x-10, this.pos.y-10, 20, 20);
    }
  },

  move: function() {
    if(App.mobile) {
      var last_state = {
        up: Key.down(input.up),
        left: Key.down(input.left),
        right: Key.down(input.right),
        shoot: Key.down(input.shoot)
      };

      Key.reset(input.up);
      Key.reset(input.right);
      Key.reset(input.left);
      Key.reset(input.shoot);

      var width = $(window).width();
      var height = $(window).height();

      for(var i = 0; i < touches.length; i++) {
        var t = touches[i];

        var x = t.pageX/width;
        var y = t.pageY/height;

        if(x > 0.5) { //right side of monitor
          x = (x-0.5)*2;    //normalize x € [0,1]
          if(y < 0.5-Math.abs(x-0.5)) { //more up than isdeways (upper half divided into an triangle)
            Key.simulate(input.up);
          }else {
            if(x > 0.5) {
              Key.simulate(input.right);
            }else {
              Key.simulate(input.left);
            }
          }
        }else {
          if(time.now > this.last_show+300) {
            Key.simulate(input.shoot);
            this.last_show = time.now;
          }
        }
      }

      //Do the dom changes to the ininput interface,
      //remember states to avoid unnecesary redundant dom accesses
      //known bugs: is not updated while player dies
      var now_state = {
        up: Key.down(input.up),
        left: Key.down(input.left),
        right: Key.down(input.right),
        shoot: Key.down(input.shoot)
      };

      for(var i = 0; i < 4; i++) {
        var state = ['up', 'left', 'right', 'shoot'][i];
        if(last_state[state] != now_state[state]) {
          if(now_state[state]) {
            $('.mbtn.'+state).addClass('active');
          }else {
            $('.mbtn.'+state).removeClass('active');
          }
        }
      }
      /*if(last_state.up != now_state.up) {
        if(now_state.up) {
          $('.mbtn.up').addClass('active');
        }else {
          $('.mbtn.up').removeClass('active');
        }
      }
      if(last_state.left != now_state.left) {
        if(now_state.left) {
          $('.mbtn.left').addClass('active');
        }else {
          $('.mbtn.left').removeClass('active');
        }
      }*/
    }

    if(this.status == 1) {    //Flying status
      if(Key.down(input.up) && this.fuel > 0) {
        this.vel.y -= Math.cos(this.rotate)*time.deltas*this.accel*200;
        this.vel.x += Math.sin(this.rotate)*time.deltas*this.accel*200;
        this.fuel -= time.deltas/10;
        this.is_accelerating = true;
        Particles.add(new Vector(
          this.pos.x-Math.sin(this.rotate)*this.size,
          this.pos.y+Math.cos(this.rotate)*this.size
        ));
      }
      if(Key.down(input.right)) {
        this.rotate += 0.1*time.deltas;
        this.rotate %=Math.PI*2;
      }

      if(Key.down(input.left)) {
        this.rotate -= 0.1*time.deltas;
        if(this.rotate < 0) {this.rotate += Math.PI*2;}
      }

      if(Key.hit(input.shoot)) {
        if(this.last_shot < getTime()) {
          this.last_shot = getTime()+100;
          Shots.add(this.pos.copy(), new Vector(Math.sin(this.rotate)*4, -Math.cos(this.rotate)*4));
        }
      }
    }
  },

  update: function() {
    this.is_accelerating = false;
    if(this.status == 0) {  //spawning
      if(this.last_animation+100 < getTime()) {
        this.frame++;
        this.last_animation = getTime();
        if(this.frame > 11) {
          this.alive();
        }
      }
    }else if(this.status == 1) {    //Flying status
      if(this.life <= 0) {
        this.dying();
      }else {
        this.move();

        this.moved = this.vel.mulC(time.deltas);  //waht the player did move
        this.pos.add(this.moved);

        this.vel.mul(Math.pow(this.reduce,time.deltas));    //abbremsen


        this.vel.y += this.gravity*time.deltas*200; //Gravity
        //limit
        if(this.pos.x < this.size) {
          this.pos.x = this.size;
          this.vel.x *= -1;
        }
        if(this.pos.y < this.size) {
          this.pos.y = this.size;
          this.vel.y *= -1;
        }

        if(this.pos.x > Map.width-this.size) {
          this.pos.x = Map.width-this.size;
          this.vel.x *= -1;
        }

        if(this.pos.y > Map.height-this.size) {
          this.pos.y = Map.height-this.size;
          this.vel.y *= -1;
        }
        //cehck for collisions

        var cols = this.lookforCollisions();

        if(cols.length > 0) {
          if(cols.length == 1) {
            this.handleCollision(cols[0]);
          }else {
            var pos = this.pos;
            var part = 2;
            var dealt = false;
            var at = 1;

            this.pos.x -= this.vel.x*time.deltas/part;
            this.pos.y -= this.vel.y*time.deltas/part;
            at -= 1/part;
            while(!dealt && part < 128) {
              var check_cols = cols;
              var cols = this.lookforCollisions(check_cols);
              if(cols.length == 1) {
                //this.pos = pos;
                this.handleCollision(cols[0]);
                dealt = true;
                //console.log("dealt at level "+part);
                //debugger;
                part *= 2;
              }else if(cols.length > 1) {
                part *= 2;
                this.pos.x -= this.vel.x*time.deltas/part;
                this.pos.y -= this.vel.y*time.deltas/part;
                at -= 1/part;
                //debugger;
              }else { //zero
                part *= 2;
                this.pos.x += this.vel.x*time.deltas/part;
                this.pos.y += this.vel.y*time.deltas/part;
                at += 1/part;
              }
              if(part > 64 && cols.length > 0) {
                this.handleCollision(cols[0]);
                dealt = true;
              }
            }
          }
        }
      }
      //debugger;
    }else if(this.status == 2) {  //Dying
      this.moved =this.vel.mulC(time.deltas); //waht the player did move
      this.pos.add(this.moved);
      this.vel.mul(Math.pow(0.9,time.deltas));    //abbremsen

      if(this.last_animation+100 < getTime()) {
        this.frame++;
        this.last_animation = getTime();
        if(this.frame > 10) {
          this.spawn();
        }
      }
    }

    if(glcounter > 2) {
      debugger;
    }
  },

  getsShot: function() {
    console.log("aua");
    this.life -= 100;
  },

  lookforCollisions: function(check_cols) {
    var col = false;
    var colat = 0;
    var col_count = 0;

    var index = Math.round(this.pos.x)+Math.round(this.pos.y)*Map.width

    var cols = [];
    if(check_cols == undefined) {

      for(var i = 0; i < Math.PI*2; i += Math.PI/4) {     //top, right, bottom, left
        var x = Math.round(Math.sin(i)*this.size);
        var y = -Math.round(Math.cos(i)*this.size);
        if(Map.mask[index+x+y*Map.width] == 1) {
          cols.push(i);
        }
      }
    }else {
      for(var it in check_cols) {
        var x = Math.round(Math.sin(check_cols[it])*this.size);
        var y = -Math.round(Math.cos(check_cols[it])*this.size);
        if(Map.mask[index+x+y*Map.width] == 1) {
          cols.push(check_cols[it]);
        }
      }
    }
    return cols;
  },

  handleCollision: function(col_at) {

    this.life -= 20;
    var length = Math.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);

    var x = Math.sin(col_at);
    var y = -Math.cos(col_at);


    this.pos.x -= this.vel.x*time.deltas;
    this.pos.y -= this.vel.y*time.deltas;

    this.vel.x -=x*length*2;  //2/3 new 1/3 old
    this.vel.y -=y*length*2;

    this.vel.x *= 0.66*0.9;   //close to normalize (at least no aceleration)
    this.vel.y *= 0.66*0.9;


    var cols = this.lookforCollisions();
    if(cols.length > 0) {
      console.log("wrong handling");
    }
  }
}