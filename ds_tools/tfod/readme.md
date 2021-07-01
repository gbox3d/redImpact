## 1. voc2tfod , 훈련 , 검증 데이터셋 나누기
라벨링원본 데이터셋을 훈련데이터셋으로 나눈다.  
usage sample<br> 
```sh
python voc2tfod.py --dataset-path ~/work/dataset/handsign
```

## 2. gen_tfrecord , 텐서플로우용 record 파일 만들기
데이터셋을 tfrecord 포멧으로 컨버팅  
```sh
python gen_tfrecord.py -x ~/work/dataset/handsign/train -l ~/work/dataset/handsign/label_map.pbtext -o ~/work/dataset/handsign/train.reecord
```
**위의 1,2 단계는 tfod.sh 파일에서 한번에 실행시킬수 있음**

## 3. update_config
훈련시킬 모델의 아키텍쳐 설정 정보가 담겨있는 pipline config 파일 업데이트   
사용법 : python update_config.py --data-file=data.yaml     
```
python update_config.py --data-file=/home/gbox3d/work/dataset/handsign/data.yaml #모델이 하나 일경우
python update_config.py -d=/home/gbox3d/work/dataset/handsign/data.yaml -m=my_ssd_model640 # 모델이 여러개일경우 선택
```
## 4. train
사용법 : tfod_train.sh  
-d 데이터셋경로  
-m 모델이름  
-e 에폭수  
-t tfod-api path  

```
bash tfod_train.sh -d /home/gbox3d/work/dataset/handsign -m my_ssd_model640 -e 1500
```
멀티GPU 사용 여부는 CUDA_VISIBLE_DEVICES 환경변수값으로 제어 할수있다.  
각각의 GPU에 batch-size 를 각각 적용한다.  
환경 변수를 세팅하지않으면 모든 GPU 를 사용한다.  
환경변수에 0 을넣으면 첫번째 GPU만 사용 , 0,1 첫번째와 두번째 GPU만 사용  

```
CUDA_VISIBLE_DEVICES="0,1" python $TFODPATH/model_main_tf2.py ....
```


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

## 7. export tflite

사용법 : export_tflite.sh tfodapi경로 모델경로   
설명 : export_tflite_graph_tf2.py 로 tflite용 그래프 파일로 만들고 tflite_conveter로 tflite파일을 만든다.  
ckpt->tflite graph -> .tflite

```
bash export_tflite.sh /home/gbox3d/tfod_models/research/object_detection /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model
```