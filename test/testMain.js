require('jasmine/jasmine.css');
jasmineRequire = require('jasmine/jasmine');
require('jasmine/jasmine-html');
require('jasmine/boot');

describe('Hello jasmine!', function() {

    it('Jasmine started, enjoy!', function() {
        expect(true).toBe(true);
    });

});
