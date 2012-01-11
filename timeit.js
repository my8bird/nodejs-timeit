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

exports.howlong = function(iterations, func, done, ignoreWarning) {
   var starttime = new Date(),
       emitter   = new EventEmitter(),
       i = 0,
       step_values = [];

   if (! _baseline && ignoreWarning === undefined ) {
      console.log('Run setBaseline before howlong to get more accurate results.');
   }

   function _runStep() {
      process.nextTick(function() {
         var step_start = new Date();
         func(function() {
            step_values.push(new Date() - step_start);
            emitter.emit('step_done');
         });
      });
   }

   function _calcAndReturn() {
      var runtime = new Date() - starttime,
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

      done(null, results);
   }

   emitter.on('step_done', function() {
      if (++i > iterations) {
         _calcAndReturn();
      } else {
         _runStep();
      }
   });

   // Kick it all off
   _runStep();
};
