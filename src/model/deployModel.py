# Imports
import base64
from os import mkdir
from sys import argv # argv contains image path
from keras.models import load_model
from io import BytesIO
from PIL import Image
from tensorflow import argmax
from keras.preprocessing import image
import numpy as np
from datetime import datetime
from collections import Counter
import tensorflow_hub as hub
from keras.utils import get_file

bird_species = ['Blackbird', 'Blackcap', 'Blue Tit', 'Bullfinch', 'Carrion Crow', 'Chaffinch', 'Chiffchaff', 'Coal Tit', 'Collared Dove', 'Common Linnet', 'Common Sandpiper', 'Common Whitethroat', 'Crossbill', 'Dotterel', 'Dunnock', 'Eurasian Jay', 'Eurasian Magpie', 'Eurasian Teal', 'Feral Pigeon', 'Fieldfare', 'Firecrest', 'Garden Warbler', 'Goldcrest', 'Golden Plover', 'Goldfinch', 'Great Spotted Woodpecker', 'Great Tit', 'Green Woodpecker', 'Greenfinch', 'Grey Wagtail', 'Hawfinch', 'House Martin', 'House Sparrow', 'Jackdaw', 'Lesser Redpoll', 'Lesser Spotted Woodpecker', 'Lesser Whitethroat', 'Long-tailed Tit', 'Meadow Pipit', 'Mealy Redpoll', 'Mistle Thrush', 'Nightingale', 'Nuthatch', "Pallas's Warbler", "Pied Flycatcher", 'Pied Wagtail', 'Redstart', 'Redwing', 'Reed Bunting', 'Robin', 'Sand Martin', 'Sedge Warbler', 'Siskin', 'Skylark', 'Song Thrush', 'Spotted Flycatcher', 'Starling', 'Stock Dove', 'Stonechat', 'Swallow', 'Swift', 'Treecreeper', 'Waxwing', 'Wheatear', 'Whinchat', 'Willow Warbler', 'Wood Warbler', 'Woodcock', 'Woodpigeon', 'Wren', 'Yellow-browed warbler']

model_path = '/root/birdclassifier/src/model/inceptiNatv0.h5'

model = load_model(
       model_path,
       custom_objects={'KerasLayer':hub.KerasLayer(incep_path)}
    ) # load ai

b64 = argv[1] # argv is the data sent to the script, argv[1] is the base64 string
b64Array = b64.split(",") # splitting into all the separate encoded images

# getting time and date for naming purposes
now = datetime.now()
time = now.strftime(f"%m-%d-%Y_%H:%M_%S%f")

predictions = []

imgs = []
for b64 in b64Array: # iterating through all images
    img = Image.open(BytesIO(base64.b64decode(b64)))   # img is now PIL Image object
    imgs.append(img)
    img = img.resize((224, 224)) # resize
    img_re = image.image_utils.img_to_array(img) # converting to np array
    img_re = np.expand_dims(img_re, axis = 0)
    prediction = model.predict(img_re, verbose = 0) # predicts, and prevents console output
    predictions.append(bird_species[prediction[0].argmax()]) # adding result to array

common_prediction = Counter(predictions).most_common()[0][0]

counter = 1
for img in imgs:
    img.save(f'/root/birdclassifier/public/bird_captures/{time}_{common_prediction}_{counter}_{str(len(imgs))}_.jpg') # saving image
    counter += 1

print([common_prediction] + predictions)
