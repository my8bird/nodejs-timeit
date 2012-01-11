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
   before(function(done) {
      timeit.setBaseline(done);
   });

   it('should run the function the correct number of times.', function(done) {
      timeit.howlong(30,
                     function(done) {
                        setTimeout(function(){ done(); }, 10);
                     },
                     function(err, values) {
                        assert.ok(values.total_runtime > 0);
                        assert.howlongValuesSet(values);
                        done();
                     }
                    );
   });

   it('should not blow the stack .', function(done) {
      timeit.howlong(30000,
                     function(done) {
                        done();
                     },
                     function(err, values) {
                        assert.ok(values.total_runtime > 0);
                        assert.howlongValuesSet(values);
                        done();
                     }
                    );
   });

   it('should produce a baseline when requested', function(done) {
      timeit.setBaseline(function(err, values) {
         assert.ok(values.total_runtime > 0);
         assert.howlongValuesSet(values);
         done();
      });
   });
});

