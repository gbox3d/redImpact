# time checker

스케쥴러 관리앱 


## how to run

```bash
npm start
```

기본 포트 20320으로 실행된다. 포트를 지정해서 가동시켜려면 다음과 같이 한다.  

```bash
node index.js 20320
```


## rest api

기본 설정 정보   
http://localhost:20320/rest/getConfig  



## 시스템 리부팅 스케쥴링


## port collection example

```text
{ 
tag: 'port',
number: '18',
port: '10020', // 디바이스 포트
ip: '192.168.4.101', //디바이스 주소
on: '0600', //켜짐시각
off: '2359', //꺼짐시각
activeVal: 0  //켜졌을때 포트의 값
}

```

## 제어 앱 접속 정보 정의

```text
remote : {
      ip : "localhost",
      port : 3010,
      udp_port : 10020
}
```
