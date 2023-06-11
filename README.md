# CNN-Bird-Classification-System

This is the code for my AI bird classification system, to classify birds in my local area. The Convolutional Neural Network (CNN) was built with transfer learning & fine-tuning of the InceptionV3 model with 
the iNaturalist2017 weights. The CNN was hosted on a server with an API that recieves images and sends them to the CNN model to be classified. The results are returned as a JSON response and uploaded to the 
website. The frontend of the website is written in vanilla JavaScript, HTML & CSS, and it allowed me to get a good grip on web development!

In order to send images to the API, they have to be converted into base64 string format and sent via a HTTP POST request. 
