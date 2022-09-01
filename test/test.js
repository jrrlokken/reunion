const assert = require('assert');

describe('Simple Calculation', function () {

  describe('Test 1', function () {
    it('should return 5 when adding 2 and 3', () => {
      assert.equal(2 + 3, 5);
    });

    it('should return 6 when multiplying 2 and 3', () => {
      assert.equal(2 * 3, 6);
      assert.notEqual(2 * 3, 7);
    });
  });
});
