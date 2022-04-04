#Import required libraries
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.optimizers import Adam, SGD
from skimage.io import imread, imsave
from skimage.transform import resize
from skimage import io
from tensorflow.keras.preprocessing import image
from lime import lime_image
from skimage.segmentation import mark_boundaries
from keras.models import model_from_json
from tensorflow import keras
import base64
import sys
#from google.colab.patches import cv2_imshow




#Import Model and load weights
def predict_covid_explainability(image_path):
    #Load the Model from Json File
    #json_file = open(aiml_dir+'/vgg16_model.json', 'r')
    json_file = open('./vgg16_model.json', 'r')
    model_json_c = json_file.read()
    json_file.close()
    model_c = model_from_json(model_json_c)
    #Load the weights
    #model_c.load_weights(aiml_dir+'/vgg16_model.h5')
    model_c.load_weights('./vgg16_model.h5')
    #Compile the model
    opt = Adam(learning_rate=0.00001) #, momentum=0.9
    #model_c.compile(loss="categorical_crossentropy", optimizer=opt,metrics=["accuracy"])
    model_c.compile(optimizer=opt, loss=keras.losses.sparse_categorical_crossentropy, metrics=['accuracy'])
    #load the image you want to classify
    images = imread(image_path)
    images = resize(images,(224,224,3))
    #cv2_imshow(image)
    #cv2_imshow(images)
    #image = np.expand_dims(img, axis=0)
    images = image.img_to_array(images)
    images = np.expand_dims(images, axis=0)
    #predict the image
    preds = model_c.predict(images)
    prediction = np.argmax(preds)
    pct = np.max(preds)
    explainer = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(images[0].astype('double'),model_c.predict,
                                        top_labels=3,hide_color=0,num_samples=1000)
    temp_1, mask_1 = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=True, num_features=5, hide_rest=True)
    temp_2, mask_2 = explanation.get_image_and_mask(explanation.top_labels[0], positive_only=False, num_features=10, hide_rest=False)
    fig, (ax1,ax2) = plt.subplots(1,2, figsize=(12,12))
    ax1.imshow(mark_boundaries(temp_1, mask_1))
    ax2.imshow(mark_boundaries(temp_2, mask_2))
    ax1.axis('off')
    ax2.axis('off')
    imsave(fname="../views/uploads/clip3.png", arr=mark_boundaries(temp_2, mask_2))
    explained_image = open('../views/uploads/clip3.png', 'rb')
    explained_image_read = explained_image.read()
    explained_image_encode = base64.encodestring(explained_image_read)
    sys.stdout.flush()
    return explained_image_encode

