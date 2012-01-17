var https = require('https');
var crypto = require('crypto');
var querystring = require('querystring');
var xml2js = require('xml2js-expat');

function AWSClient(secret_access_key, aws_access_key_id, host) {
    this.secret_access_key = secret_access_key;
    this.aws_access_key_id = aws_access_key_id;
    this.host = host;
}

AWSClient.prototype.run = function(endpoint, action, parameters, success, error) {
    parameters['Action'] = action;
    parameters['AWSAccessKeyId'] = this.aws_access_key_id;
    parameters['Timestamp'] = new Date().toISOString();
    parameters['SignatureVersion'] = '2';
    parameters['SignatureMethod'] = 'HmacSHA256';
    parameters['Version'] = '2011-10-01';

    var chunks = [];
    for(var index in parameters) {
        chunks.push(index);
    }
    chunks.sort();

    var canonicalized_chunks = [];
    for(var index in chunks) {
        var key = chunks[index];
        canonicalized_chunks[key] = parameters[key];
    }

    var canonicalized_query_string = querystring.stringify(canonicalized_chunks);
    canonicalized_query_string = canonicalized_query_string.replace(/%2B/g, '+'); 
    canonicalized_query_string = canonicalized_query_string.replace(/%7E/g, '~'); 
    var host = this.host;
    var stringToSign = ['POST', host.toLowerCase(), endpoint, canonicalized_query_string].join('\n');
    var hmac = crypto.createHmac('sha256', this.secret_access_key);
    hmac.update(stringToSign);
    var signature = hmac.digest('base64');
    parameters['Signature'] = signature;
    var body = querystring.stringify(parameters);
    var options = {
        host: host,
        path: endpoint,
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        method: 'POST'
    };
    var req = https.request(options, function(res) {
        var reply = '';
        res.on('data', function(d) {
            reply += d;
        });
        res.on('error', function(err) {
            error(err);
        });
        res.on('end', function() {
            var x2js = new xml2js.Parser(function(r) {
                success(r);
            });
            x2js.parseString(reply);
        });
    });
    req.write(body);
    req.end();
}

exports.createClient = function(secret_access_key, aws_access_key_id, host) {
    return new AWSClient(secret_access_key, aws_access_key_id, host);
}
