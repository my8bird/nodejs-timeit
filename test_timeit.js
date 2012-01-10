var timeit = require('./timeit'),
    assert = require('assert');

describe('Timing function iteration is fun', function(){
   var iterations = 30;
   it('should run the function the correct number of times.', function(done) {
      timeit.howlong(iterations, function(done) {
         setTimeout(function(){ done(); }, 10);
      }, function(duration) {
         if (duration <= 0) {throw 'duration should be positive';};
         done();
      });
   });

   it('should not blow the stack .', function(done) {
      var iterations = 30000;
      timeit.howlong(iterations, function(done) {
         done();
      }, function(duration) {
         if (duration <= 0) {throw 'duration should be positive';};
         done();
      });
   });
});

