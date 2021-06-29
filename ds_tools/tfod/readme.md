## 1. voc2tfod
라벨링원본 데이터셋을 훈련데이터셋으로 나눈다.  
usage sample<br> 
```sh
python voc2tfod.py --dataset-path ~/work/dataset/handsign
```

## 2. gen_tfrecord
데이터셋을 tfrecord 포멧으로 컨버팅  
```sh
python gen_tfrecord.py -x ~/work/dataset/handsign/train -l ~/work/dataset/handsign/label_map.pbtext -o ~/work/dataset/handsign/train.reecord
```

## 3. update_config
훈련시킬 모델의 아키텍쳐 설정 정보가 담겨있는 pipline config 파일 업데이트   
사용법 : python update_config.py --data-file=data.yaml     
```
python update_config.py --data-file=/home/gbox3d/work/dataset/handsign/data.yaml
```

**위의 1,2,3 단계는 tfod.sh 파일을 참고할것**


## 4. train

train.sh 스크립트 참고  

## 5. export savedmodel

사용법 : export.sh tfodPath modelPath  

```sh
bash export.sh /home/gbox3d/tfod_models/research/object_detection /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model
```

## 6. export tfjs
사용법 : export_tfjs.sh modelPath  
```
export_tfjs.sh /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model 
```