/*global setTimeout: false */

var timeit = require('./timeit'),
    assert = require('assert');

assert.howlongValuesSet = function(values) {
   assert.ok(undefined !== values.total_runtime);
   assert.ok(undefined !== values.total_step_runtime);
   assert.ok(undefined !== values.average_step_runtime);
   assert.ok(undefined !== values.total_off_baseline);
   assert.ok(undefined !== values.total_step_off_baseline);
   assert.ok(undefined !== values.average_step_off_baseline);
};


describe('Timing functions', function() {
   it('should run the function the correct number of times.', function(done) {
      timeit.howlong(30,
                     function(done) {
                        setTimeout(function(){ done(); }, 10);
                     },
                     function(err, results) {
                        assert.ok(results[1].total_runtime > 0);
                        assert.howlongValuesSet(results[1]);
                        done();
                     }
                    );
   });

   it('should not blow the stack .', function(done) {
      timeit.howlong(30000,
                     function(done) {
                        done();
                     },
                     function(err, results) {
                        assert.ok(results[1].total_runtime > 0);
                        assert.howlongValuesSet(results[1]);
                        done();
                     }
                    );
   });

   it('should handle a list of funcs to test', function(done) {
      timeit.howlong(3000,
                     [
                        function(done) {
                           done();
                        },
                        function(done) {
                           done();
                        }
                     ],
                     function(err, results) {
                        assert.ok(results[0].total_runtime > 0);
                        assert.ok(results[1].total_runtime > 0);
                        assert.howlongValuesSet(results[0]);
                        assert.howlongValuesSet(results[1]);
                        done();
                     }
                    );
   });

});

