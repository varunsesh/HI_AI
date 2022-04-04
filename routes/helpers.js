var request = require('request-promise');

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};



function base64_decode(base64str) {
    var fs = require('fs');
    
    fs.writeFile('./uploads/explain.png', base64str, {encoding: 'base64'}, function(err) {
      console.log('File created');
    });
   }

const explained = async function explain() {
    
    var options = {
        method: 'GET',
  
        // http:flaskserverurl:port/route
        uri: 'http://127.0.0.1:5000/',
        body: "",
  
        // Automatically stringifies
        // the body to JSON 
        json: true
    };
  
    var sendrequest = await request(options)
  
        // The parsedBody contains the data
        // sent back from the Flask server 
        .then(function (parsedBody) {
            console.log(parsedBody);
              
            // You can do something with
            // returned data
            let result;
            result = parsedBody['result'];
            //console.log(result);
        })
        .catch(function (err) {
            console.log(err);
        });
}

exports.imageFilter = imageFilter;
exports.explained = explained; 
exports.base64_decode = base64_decode;

