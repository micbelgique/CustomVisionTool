# CustomVisionTool

A tool to use Custom Vision Prediction

## Custom Vision

Once you are on [customvision.ai](customvision.ai), create a project.
![Create Project](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-createproject.png)

### Create your model

After your project is created, you will be on the tab training images but you don't have once so, you will need to add them by clicking add images.
![Add Images](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-createmodel.png)
Upload your pictures and after it, you will need to tag them. You can make a rectangle near what you want to be tagged and give it a tag.
![Add tag](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-tag.png)

### Train your model

After adding you pictures, you will need to train your model to recognize the tag on your pictures. You will need to click on the green button nammed Train. There you can choose if you prefer to make a quick training or an advanced training. An Advanced training will take more time but will be more precise in detection.
![Choose your training type](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-training.png)

### Publish your model

When the training is over, you can go in performance tab and find your iteration. If you want to be able to predict by our tool or by another app using the customvision API, you need to publish the iteration. You will need to choose which prediction ressource you will use to publish it.
![Publish your iteration](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-publish.png)
After this, you can go inside prediction URL and take the url prediction and the prediction key to put them later inside our tool.
![Url and Key](https://github.com/micbelgique/CustomVisionTool/blob/master/pictures/customvision-urlkey.png)

## How to use the tool

### Use It with an online model

![Settings Part](https://github.com/micbelgique/CustomVisionTool/blob/develop/pictures/settings.png)
You need to put your endpoint and key of customvision inside the settings part and after this, just click on the save button.
![Scan Part](https://github.com/micbelgique/CustomVisionTool/blob/develop/pictures/scanner.png)
After the save button clicked, you will be redirect inside the scanner part. There you can use the camera of your computer to detect things from your model.

### Use It with an offline

You need to click on working locally and to put the url of your models exported on Custom Vision app. You will need to put your label and the model.
