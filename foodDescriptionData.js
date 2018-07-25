var AWS = require('aws-sdk');
var s3 = new AWS.S3();
exports.handler = function(event, context, callback) {
        var params = { Bucket: process.env.S3_BUCKET, Key: process.env.S3_KEY };
        s3.getObject(params, function (err, data) {
            if (!err) {
                var bodyToString = JSON.parse(data.Body.toString());
                callback(null, bodyToString);
            } else {
                console.log(err);
                callback(new Error('S3 get error - ' + err), 'error');
            }
        });
};
