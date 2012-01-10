var active        = false,
    howlong_calls = [];

function _startTimeit(howlong_args) {
   active = true;
};

function _endTimeit() {
   active = false;
};


function _howlong(iterations, func, done) {
   var i = 0;

   function when_iter_done() {
      if (++i < iterations) {
         func(when_iter_done);
      } else {
         done();
      }
   }

   func(when_iter_done);
}

exports.howlong = function(/* @see _howlong */) {
   var whendone  = arguments[arguments.length-1],
       args      = Array.prototype.slice.call(arguments, 0, arguments.length-1),
       starttime;

   if (active) {
      howlong_calls.push(arguments);
      return;
   }

   // Add the method to call when the loop is done.
   args.push(function () {
      var endtime = new Date();
      whendone(endtime - starttime);
   });

   starttime = new Date();
   _howlong.apply(null, args);
};
