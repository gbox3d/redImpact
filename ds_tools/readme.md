## dataset 생성

create_ds.py 으로 기본적인 폴더구조와 data.yaml 파일생성   
예>
```
# 줄바꿈
python create_ds.py \
  -d=/home/gbox3d/work/dataset \
  -n=hello \
  -c=ok,hi,hello,bye,well \
  -f=ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8 \
  -b=32

#한줄
python create_ds.py -d ~/work/dataset/ -n mecard -c="kooroogee,gargotose,shooma" -f ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8 -b 8

python create_ds.py -d ~/work/dataset/ -n handsign -c "ok,no,good,bad"

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
