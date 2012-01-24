var assert = require('assert');
var aws = require('../lib/aws');

suite('request', function() {
    test('should be signed correctly', function() {
        var client = aws.createClient('secret', 'id', 'somehost.com');
        var signature = client.sign('/something', 'SomeAction', [], '2012-01-24T18:25:59.428Z');
        assert.equal('OUn/TVrgK+xHhyud3GgHWQdtpFMqhvpZBTa8w4Vk02M=', signature);
    });
});
