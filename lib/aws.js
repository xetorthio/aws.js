var https = require('https');
var crypto = require('crypto');
var querystring = require('querystring');
var xml2js = require('xml2js-expat');

function AWSClient(secret_access_key, aws_access_key_id, host) {
    this.secret_access_key = secret_access_key;
    this.aws_access_key_id = aws_access_key_id;
    this.host = host;
}


AWSClient.prototype.sign = function(endpoint, action, parameters, date) {
    parameters['Action'] = action;
    parameters['AWSAccessKeyId'] = this.aws_access_key_id;
    parameters['Timestamp'] = date;
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
    canonicalized_query_string = canonicalized_query_string.replace(/%7E/g, '~'); 
    var stringToSign = ['POST', this.host.toLowerCase(), endpoint, canonicalized_query_string].join('\n');
    var hmac = crypto.createHmac('sha256', this.secret_access_key);
    hmac.update(stringToSign);
    var signature = hmac.digest('base64');
    parameters['Signature'] = signature;
    return signature;
}

AWSClient.prototype.run = function(endpoint, action, parameters, success, error) {
    this.sign(endpoint, action, parameters, new Date().toISOString());
    var body = querystring.stringify(parameters);
    var options = {
        host: this.host,
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
                if(res.statusCode==400 || res.statusCode==401 || res.statusCode == 403 || res.statusCode == 404 || res.statusCode == 500 || res.statusCode == 503) {
                    error(r);
                } else {
                    success(r);
                }
            });
            x2js.parseString(reply);
        });
    });
    req.setTimeout(2000, function() {
        req.abort();
    });
    req.write(body);
    req.end();
}

exports.createClient = function(secret_access_key, aws_access_key_id, host) {
    return new AWSClient(secret_access_key, aws_access_key_id, host);
}
