var EventEmitter = require('events').EventEmitter,
    _baseline = null;


function _howlong(iterations, func, done) {
   var i = 0;

   function when_iter_done() {
      if (++i < iterations) {
         process.nextTick(function() {
            func(when_iter_done);
         });
      } else {
         done();
      }
   }

   func(when_iter_done);
}

exports.setBaseline = function(whendone) {
   exports.howlong(30000,
                   // Use the fastest possible function
                   function(done) {
                      done();
                   },
                   // Store the values for later use and return to caller
                   function(err, values) {
                      _baseline = values;
                      whendone(err, values);
                   },
                   true
                  );
};


function now() {
   return (new Date()).getTime();
}

exports.howlong = function(iterations, func, done, ignoreWarning) {
   var starttime = now(),

       i = 0,
       step_values = [];

   if (! _baseline && ignoreWarning === undefined ) {
      console.log('Run setBaseline before howlong to get more accurate results.');
   }

   function _calcAndReturn() {
      var runtime = now() - starttime,
          total = step_values.reduce(function(value, item) { return value + item; }),
          average = total / iterations,
          results = {
             total_runtime:        runtime,
             total_step_runtime:   total,
             average_step_runtime: average
          };

      if (_baseline) {
         results.total_off_baseline        = runtime - _baseline.total_runtime;
         results.total_step_off_baseline   = total   - _baseline.total_step_runtime;
         results.average_step_off_baseline = average - _baseline.average_step_runtime;
      }

      process.nextTick(function(){ done(null, results); });
   }

   function _runStep() {
      if (++i > iterations) {
         return _calcAndReturn();
      }

      process.nextTick(function() {
         var step_start = now();
         func(function() {
            step_values.push(now() - step_start);
            _runStep();
         });
      });
   }

   // Kick it all off
   _runStep();
};
