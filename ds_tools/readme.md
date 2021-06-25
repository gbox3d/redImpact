## dataset 생성

create_ds.py 으로 기본적인 폴더구조와 data.yaml 파일생성   
예>
```
python create_ds.py \
  -d=/home/gbox3d/work/dataset \
  -n=hello \
  -c=ok,hi,hello,bye,well \
  -f=ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8 \
  -b=32 
```

폴더 구조  
```
src/   --> 원본 이미지
voc/   --> voc 형식의 라벨링 데이터
workspace/  --> tfod 형식의 훈련 작업 공간
  models
  pre-trined-models
data.yaml  --> 기본적으로 yolov5용 설정파일에 tfod용 설정정보 추가됨
```

## tfod 훈련 데이터 준비하기 

1. voc2tfod.py 로 훈련과 검증 데이터셋 분할  
2. gen_tfrecord.py 로 tfrecord 파일 생성  
3. update_config.py 로 pipeline_config 파일 수정하기    

* 예제는 './tfod/tfod.sh' 파일 참고  