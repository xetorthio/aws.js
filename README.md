# aws.js

aws.js is a dead simple and sane Amazon Web Services client for node.js

aws.js is very simple to use and do only the most basic stuff for you: signing the request and converting XML to a usable data structure.

## How do I install it?

Install it as an npm package

```bash
npm install aws.js
```

## How do I use it?

```javascript
var client = aws.createClient('secret_access_key', 'aws_access_key_id', 'ec2.amazonaws.com');
var signature = client.sign('/', 'RunInstances', {'ImageId':'ami-60a54009', 'MaxCount':3, 'MinCount':1, 'Placement.AvailabilityZone':'us-east-1b', 'Monitoring.Enabled':'true'}, function(response) {
    console.log('Everything is OK. Here is what amazon API returned:');
    console.log(response);
}, function(error) {
    console.log('There is an error:');
    console.log(error);
});

```

For more usage examples check the tests.

## I want to contribute!

That is great! Just fork the project in github. Create a topic branch, write some code, and add some tests for your new code.

To run the tests use mocha.

Thanks for helping!

## License

Copyright (c) 2012 Jonathan Leibiusky

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

