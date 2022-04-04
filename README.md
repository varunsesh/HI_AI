# AI Radiology Assistant Prediction App

This is a AI based radiology assistant app. The main objective is to run an AI prediction algorithm to try and catch early onset of pneumonia in covid patients.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have installed Node.js, NPM and MongoDB in your System.

### Installing
```
npm install
```

### To Run
```
npm start
```

For dev mode:
```
npm run dev
```
## Integration with explainable AI
The explainable AI uses a python specific module called LIME. This package is not yet available with nodejs. Therefore the explainable_ai module runs as a separate flask service. 
To run the app with this module you will need to run two services at the same time. Ideally they should be hosted separately but here for conveinience we have saved it in the same repository.
To install the prerequisties
```
cd explainable_ai
```
```
pip install -r requirements.txt
```
```
python3 app.py
```
This will run the flask service that serves the explainable AI module.

Once started up, open a separate terminal instance and run
```
npm start
```

You should now have the main application at http:://localhost:3000.
The explainable AI module takes some time to run. Therefore once you click explain, it will take around 1 min to finish saving the image. Refresh the page after a minute to see the correct result rendered. 

## NOTE
Everytime the /explain route page is refreshed, the explainable ai module runs and saves the image again. Ideally it should send a base64 encoded image that is then decoded on the UI side. At the moment it does send the base64 encoding but it also saves the raw image in a location known to the nodejs service. The send - request between the two services needs cleaning up. 

The model vgg16_model.h5 must be downloaded before using explainable AI service.


Thanks to https://github.com/FSojitra/Node.js-Register-Login-App for the base code.