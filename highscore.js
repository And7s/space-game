var Highscore = {
  data: [],

  initialize: function() {
    log("highscore inita");


    this.renderpage();
  },

  renderpage: function() {
    var that = this;
    $.ajax({
      url: 'https://and7s.de/static/space/submit-score.php',
      dataType: 'json',
      success: function(data) {
        that.data = data;
        // transform data
        var arr = [[],[],[],[]];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          arr[data[i].level].push(data[i]);
        }
        console.log(arr);
        $('#highscore-wrap').html(
          _.template($('#tmpl-highscore').html())({arr: arr})
        );
      }
    });
  },

  logging: function(message) {

    var obj = {
      resolution: {
        x: App.width,
        y: App.height,
        max_y: window.screen.availHeight,
        max_x: window.screen.availWidth
      },
      client: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    var base = btoa(JSON.stringify(obj));
    $.ajax({
      url: 'https://and7s.de/static/space/logging.php',
      type: 'POST',
      data: {
        message: message,
        blob: base
      }
    });

  },


  showFinished: function() {
    var data = _.filter(this.data, function(d) { return d.level == App.level; });
    var seat = 0; //fst
    for(var i = 0; i < data.length; i++) {
      if(App.duration >= data[i].score ) {
        seat = i+1;
      }
    }
    if(seat == data.length && data.length > 0) {
      seat = -1;
    }

    $('#m2').html(
      _.template($('#tmpl-finished').html())({secs: (App.duration/1000), hs: data, seat: seat})
    );
    $('#menu').addClass('active');

    $('.js-submit-score').click(function() {
      $.post('https://and7s.de/static/space/submit-score.php', {
        name: $('#my-name').val(),
        level: App.level,
        score: App.duration
      }, function(data) {
        Menu.showHome();
      });
    })
  }
};