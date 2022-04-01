//classifier.js
var model;
var predResult = document.getElementById("result");

async function predict() {
  $.Toast.showToast({

    // toast message
    "title": "Loading results. Please wait...",

    // "success", "none", "error"
    "icon": "loading"

  });
    // action for the submit button
    model = await tf.loadLayersModel('/model/model.json');

    //tf.loadLayersModel('/model/model.json').then(model => {
    const image = document.getElementById("xray-file")
    //const predictions = model.predict(image);
    const tensorImg =   tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();

    prediction = await model.predict(tensorImg).data();

    if (prediction[0] > prediction[1]) {
      var cov_per = (Math.round(prediction[0] * 100)).toFixed(2);
      predResult.innerHTML = "Diagnosis: Covid with " + cov_per +"% probability" ;
    } else {
      var cov_per = (Math.round(prediction[1] * 100)).toFixed(2);
      predResult.innerHTML = "Diagnosis: Non-Covid with " + cov_per +"% probability"  ;
    }

//});
}

async function explain() {
  // action for the submit button
  model = await tf.loadLayersModel('/model/model.json');
}