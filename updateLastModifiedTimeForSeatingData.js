var AWS = require('aws-sdk');
var ssm = new AWS.SSM({apiVersion: '2014-11-06'});

exports.handler = (event, context, callback) => {
    var currentTime = new Date().toISOString(); // UTC time
    var params = {
        Name: process.env.MODIFIED_TIME_NAME, /* required */
        Type: "String", /* required */
        Value: currentTime,
        Overwrite: true
    };
    ssm.putParameter(params, function(err, data) {
      if (err) {
          console.log(err, err.stack); // an error occurred
          callback(new Error('SSM error'), err.stack)
      }
      else {
          console.log(data.Version);           // successful response
          callback(null, data)
      }
    });
};
