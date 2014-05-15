var EventEmitter = require('events').EventEmitter,
    _baseline    = null;


// Allow running on all versions of Node
var breakRecursion = global.setImmediate || process.nextTick;

function _howlong(iterations, func, done) {
   var i = 0;

   function when_iter_done() {
      if (++i < iterations) {
         breakRecursion(function() {
            func(when_iter_done);
         });
      } else {
         done();
      }
   }

   func(when_iter_done);
}

function now() {
   return (new Date()).getTime();
}

function _howlong(iterations, func, done, ignoreWarning) {
   var starttime = now(),

       i = 0,
       step_values = [];

   if (! _baseline && !ignoreWarning) {
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

      breakRecursion(function(){ done(null, results); });
   }

   function _runStep() {
      if (++i > iterations) {
         return _calcAndReturn();
      }

      breakRecursion(function() {
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


function _baseline_func(done) {
   done();
}


exports.howlong = function(iterations, funcs, done) {
   var i = 0, results = [];

   if (! Array.isArray(funcs) ) {
      funcs = [_baseline_func, funcs];
   } else {
      funcs.splice(0, 0, _baseline_func);
   }

   function _whendone(err, values) {
      results.push(values);

      if (i === 0) { // Baseline run
         _baseline = values;
      }

      if (++i === funcs.length) {
         done(null, results);
      } else {
         _runNext();
      }
   }

   function _runNext() {
      _howlong(iterations, funcs[i], _whendone, i === 0);
   }

   _runNext();
};
