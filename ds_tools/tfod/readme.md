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

```sh
bash tfod.sh -d /home/gbox3d/work/dataset/mecard
```

## 3. update_config
훈련시킬 모델의 아키텍쳐 설정 정보가 담겨있는 pipline config 파일 업데이트   
사용법 : python update_config.py -d data.yaml경로 -m 모델이름

data.yaml에 정의된 모델이 1개일경우 -m 옵션은 생략된다.  

모델이 여러개일경우 예
```
tf :
  my_ssd_model : 
    pipeline_config : /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model/pipeline.config 
    label_map_file : /home/gbox3d/work/dataset/handsign/workspace/label_map.pbtext
    train_batch_size : 16
    train_record : /home/gbox3d/work/dataset/handsign/workspace/train.record
    valid_record : /home/gbox3d/work/dataset/handsign/workspace/valid.record
    fine_tune_checkpoint : /home/gbox3d/work/dataset/handsign/workspace/pre-trained-models/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8/checkpoint/ckpt-0
    fine_tune_checkpoint_type : 'detection'
  my_ssd_model640 : 
    pipeline_config : /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model640/pipeline.config 
    label_map_file : /home/gbox3d/work/dataset/handsign/workspace/label_map.pbtext
    train_batch_size : 16
    train_record : /home/gbox3d/work/dataset/handsign/workspace/train.record
    valid_record : /home/gbox3d/work/dataset/handsign/workspace/valid.record
    fine_tune_checkpoint : /home/gbox3d/work/dataset/handsign/workspace/pre-trained-models/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8/checkpoint/ckpt-0
    fine_tune_checkpoint_type : 'detection'
```

위와 같이 my_ssd_model,my_ssd_model640 을 따로 정의할경우 -m 옵션으로 모델을 선택한다.

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
bash tfod_train.sh -d /home/gbox3d/work/dataset/mecard -m custom_model  -e 500
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
**라즈베리 전용**   
tflite를 만들기 위해서는 tflite용 savemodel 파일이 필요하다.  
export_tflite_graph_tf2.py 로 tflite용 savemodel을 만들어  tfliteexport/ 에 저장하고  
tflite_convert cli 툴로 변환하는 과정을 export_tflite.sh에 구현했다.  
단 여서거 얻어진 tflite 파일은 라즈베리같은 arm-linux 용이므로 안드로이드나 ios같은 모바일 디바이스에서 사용하고싶다면 다음단계에서 수행하는 작업을 통해 얻어지는 tflite를 사용해야한다.  

사용법 : export_tflite.sh tfodapi경로 모델경로   
설명 : export_tflite_graph_tf2.py 로 tflite용 그래프 파일로 만들고 tflite_conveter로 tflite파일을 만든다.  
ckpt->tflite graph -> .tflite

```
bash export_tflite.sh /home/gbox3d/tfod_models/research/object_detection /home/gbox3d/work/dataset/handsign/workspace/models/my_ssd_model
```

## 8 . export tflite for mobile device

**안드로이드,ios같은 모바일 디바이스용.**  
추가적으로 메타 데이터 파일을 포함시켜주어야한다.  
.tflite-> .meta.tflite
파이썬 api로 구현하였으며 7번단계에서 얻어진 tflite용 savemodel을 가지고 변환키켜서 메타데이터를 추가시켜 파일로 출력한다.  

인자설명 :  
-d 데이터셋이름   
-m 모델이름  

사용예 :  
```
python tflite_exporter.py -d handsign -m my_ssd_model640
```


참고자료 : https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/running_on_mobile_tf2.md  

## 9 텐서보드 

tfod 에서는 로그경로는 트래이닝 작업 최상위폴더를 그대로 지정해준다.  
사용예 :
```
tensorboard --logdir ~/work/dataset/handsign/workspace/models/my_ssd_model
```

