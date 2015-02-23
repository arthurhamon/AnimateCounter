function Doin(step, duration, done){
  this.duration = duration || 2;
  this.step = step;
  this.done = done;
  this.stop = false;
};

Doin.prototype = {
  run : function(){
    var startTime = new Date(),
        that = this;

    (function run(){
      var now, t;

      now = new Date();
      elapsed = (now - startTime)/1000;
      t = (elapsed/that.duration);

      // do a step on each frame
      that.step(t, elapsed);

      // stop sequence if duration has passed
      if( t < 1 || that.stop )
        // change the below with fastDom.write...
       // requestAnimationFrame(run);  // can also use: setTimeout(run, 60/1000)
       setTimeout(run, 60/1000); 
      else if(that.done)
        that.done();
    })();
  }
};

var easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
  // exponential decelerating
  exp: function (t) { return (1-Math.exp(-t*7)) }
};

// constructor to run a specific job
function AnimateCounter(el, duration, maxValue, easingFunc){
  this.el = el[0];
  duration = el[0].getAttribute('data-duration') || duration || 3;

  // get variables
  this.maxValue = el[0].getAttribute('data-max') || maxValue;
  this.easing = easing[el[0].getAttribute('data-easing')] || easingFunc;

  $(this.el).addClass("doin");
  // create an instance
  this.doin = new Doin(this.step.bind(this), duration, this.done.bind(this)).run();
}

// a step of the thing we want to do
AnimateCounter.prototype.step = function(t, elapsed){
  // easing
  t = this.easing(t);

  // calculate new value
  var value = this.maxValue * t;

  // limit value
  if( value > this.maxValue || t > 0.999 )
    value = this.maxValue;

  // print value
  this.el.innerHTML = value|0;
}
// on DONE
AnimateCounter.prototype.done = function(){
  $(this.el).removeData('doin');
  $(this.el).removeClass("doin");
}
