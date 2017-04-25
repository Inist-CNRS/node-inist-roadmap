const assert = require('chai').assert;
const tlnp = require('../lib/trello-list-name-parser.js');

describe('the trello list name parser', () => {
  const listNameMAMA = 'Janvier 2015 - Février 2015';
  it(`should parse "${listNameMAMA}"`, () => {
    const range = tlnp(listNameMAMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-03-01');
  });

  const listNameMAMA2 = 'Janvier 2015 - Fevrier 2015';
  it(`should parse "${listNameMAMA2}"`, () => {
    const range = tlnp(listNameMAMA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-03-01');
  });

  const listNameMA = 'Janvier 2015';
  it(`should parse "${listNameMA}"`, () => {
    const range = tlnp(listNameMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-02-01');
  });

  const listNameA = '2015';
  it(`should parse "${listNameA}"`, () => {
    const range = tlnp(listNameA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-01-01');
  });

  const listNameAA = '2014-2015';
  it(`should parse "${listNameAA}"`, () => {
    const range = tlnp(listNameAA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2014-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-01-01');
  });

  const listNameMMA = 'janvier-mars 2015';
  it(`should parse "${listNameMMA}"`, () => {
    const range = tlnp(listNameMMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-04-01');
  });

  const listNameMMA2 = 'XXXXXXX janvier-mars 2016';
  it(`should parse "${listNameMMA2}"`, () => {
    const range = tlnp(listNameMMA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-04-01');
  });

  const listNameMM = 'janvier-mars';
  it(`should parse "${listNameMM}"`, () => {
    const range = tlnp(listNameMM);
    assert.instanceOf(range, Error, `${listNameMM} is not enough precise cause do not have a year in the string`);
  });

  const listNameTA = '1er trimestre 2016';
  it(`should parse "${listNameTA}"`, () => {
    const range = tlnp(listNameTA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-04-01');
  });

  const listNameTA2 = '2eme trimestre 2016';
  it(`should parse "${listNameTA2}"`, () => {
    const range = tlnp(listNameTA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-04-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-07-01');
  });

  const listNameTA3 = '2ème trimestre 2016';
  it(`should parse "${listNameTA3}"`, () => {
    const range = tlnp(listNameTA3);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-04-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-07-01');
  });
});
