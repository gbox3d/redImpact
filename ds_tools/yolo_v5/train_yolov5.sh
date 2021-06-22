#!/bin/bash
cd ../../../yolov5
python train.py --data ../dataset/test/data.yaml --cfg yolov5s.yaml --batch 16 --epoch 5 
cd -
