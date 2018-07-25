var AWS = require('aws-sdk');
var ssm = new AWS.SSM({apiVersion: '2014-11-06'});

exports.handler = (event, context, callback) => {
    var successfulResponse = {
        'statusCode': 200,
        'headers': { 'Content-Type': 'application/json' },
    };
    var errorResponse = {
        'headers': { 'Content-Type': 'application/json' },
    };

    if(event["queryStringParameters"] && event["queryStringParameters"]["for"]) {
        var parameterName = '';
        if(event["queryStringParameters"]["for"] === 'food') {
            parameterName = process.env.FOOD_MODIFIED_TIME_NAME;
        } else if(event["queryStringParameters"]["for"] === 'seating') {
            parameterName = process.env.SEAT_MODIFIED_TIME_NAME;
        } else {
            errorResponse['statusCode'] = 400;
            errorResponse['body'] = JSON.stringify({'message': 'The for query parameter isnt food or seating'});
            callback(null, errorResponse);
        }
        var params = {
        Name: parameterName, /* required */
        WithDecryption: true
        };
        ssm.getParameter(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              errorResponse['statusCode'] = 500;
              errorResponse['body'] = JSON.stringify({'error': 'ssm getParameter error'})
              callback(null, errorResponse);
          }
          else {
              console.log(data.Parameter.Value);           // successful response
              successfulResponse['body'] = JSON.stringify(data.Parameter.Value)
              callback(null, successfulResponse);
            }
        });
    } else {
        errorResponse['statusCode'] = 400;
        errorResponse['body'] = JSON.stringify({'message': 'No "For" query parameter'})
        callback(null, errorResponse);
    }
};
