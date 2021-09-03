## 데이터셋 생성 유틸
yolo형식에 맞는 트레인 세트 구성한다.  

사용 예
```
python voc2yolo.py --dataset-path /home/gbox3d/work/dataset/handsign
```

## 학습

사용 예
```
bash train_yolov5.sh -d ~/work/dataset/handsign/ -e 10000 -w yolov5s.pt -b 64
```

## 텐서보드 사용하기

사용 예
```
cd ~/work/dataset/handsign/workspace/yolov5_train_jobs/
tensorboard --logdir ./
```