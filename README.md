# Easeplantz Backend Service
![easeplantz logo](readme-img/easeplantz-logo.png)
<!-- MarkdownTOC levels="1,2,3" autolink="true"  -->
- [Introduction](#introduction)
- [Overview of API Features](#overview)
- [List of Methods](#list-of-methods)
    - [GET Service](#get-service)
    - [POST Service](#post-service)
    - [DELETE Service](#delete-service)
- [Implementation and Workflow Example for Backend](#implementation-and-workflow-example-for-backend)
- [API Call Scenario](#api-call-scenario)
- [Contributor](#contributor)
<!-- /MarkdownTOC -->

## Introduction
Easeplantz Backend Service is a backend service based on Node.JS and Express library to provide an API support for Easeplantz Android and Web Application.

This Backend Service enables us to use instant prediction by uploading image using multipart/form-data type and responding with diseases and prediction accuracy rate.

The Backend Service uses Tensorflow.js-node as the base for processing images and doing prediction using pre-trained models from the Easeplantz Machine Learning Engineers.

## Overview
This Backend Service has three main service installed on it:

- **Upload Services**: Services for uploading images to server and storing it into the server.
- **Prediction Services**: Services that consuming pre-trained models to  predict plant diseases using tensorflow.js.
- **GET Services**: Services to list all predicted images and their prediction results.

## List of Methods
Here are the list of the endpoints and the usages of Easeplantz Backend Services:

### GET Services
The GET Services enables Easeplantz Backend Service to list all predicted plants and their prediction results. This GET Services includes filtering the results with url queries.

To list all predicted images:
> GET https://api.easeplants.ml/upload

To list all predicted **corn** images:
> GET https://api.easeplants.ml/upload?model=corn

To list all predicted **potato** images:
> GET https://api.easeplants.ml/upload?model=potato

To list all predicted **tomato** images:
> GET https://api.easeplants.ml/upload?model=tomato

### POST Services
The POST Services enables the Easplantz Backend Services to receives client image requests and storing the results on the server. This POST services uses the _multipart/form-data_ with _predict-img_ key name for uploading into the server.

To upload the image into the server:
> POST https://api.easeplants.ml/upload?model=[modelname]

This model name can be changed into any of three provided models (corn, potato, and tomato). So in examples, to upload **corn** images into the server:

> POST https://api.easeplants.ml/upload?model=corn

### DELETE Services
The DELETE Services wipes all the stored and predicted images on the server based on the model names. To delete the services:

> DELETE https://api.easeplants.ml/upload?model=[modelname]

This model name can be changed into any of three provided models (corn, potato, and tomato). So in examples, to upload **corn** images into the server:

> DELETE https://api.easeplants.ml/upload?model=corn

## Implementation Example for The Backend Service
In the Easeplantz Capstone Project, the Backend is used to provide API support for Android Application and Front-end Web Application. To view the documentations about these services, please visit this link:

- [Android Application Repository](https://github.com/nfach98/easeplantz)
- [Front-end Web Application Repository](https://github.com/gerald-apm/easeplantz-frontend)

## Contributor
This Easeplantz Backend Repository was a part of the Easeplantz Capstone Project from Bangkit Academy 2021 Program. Please welcome the contributors of this project:

- [A2842630 - Nino Fachrurozy](https://github.com/nfach98)
- [A0040244 - Eldhian Bimantaka Christianto](https://github.com/Eldhianbmntaka)
- [C1801846 - Sablina Damayanti](https://github.com/)
- [C1031406 - Geraldhi Aditya Putra Mahayadnya](https://github.com/gerald-apm)
- [M0040333 - Dympna Tinezsia Adhisti](https://github.com/dhiisti)
- [M0040318 - Mpu Hambyah Syah Bagaskara Aji](https://github.com/mpuhambyah)


Easeplantz Project 2021. All rights reserved.