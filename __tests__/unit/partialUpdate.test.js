const sqlForPartialUpdate = require('../../helpers/partialUpdate');

describe('sqlForPartialUpdate()', () => {
  let test = {
    name: 'billy',
    num_employees: 10,
    description: 'a fun guy company',
  };

  it('should generate a proper partial update query with just 1 field', function () {
    let updateTest = {
      name: 'bob',
      num_employees: 2,
    };
    // comparing values, so we use .toEqual
    expect(sqlForPartialUpdate(test, updateTest, 'name', 1)).toEqual(expect.objectContaining({ values: ['bob', 2, 1] }));
  });
});
