# the red wine   
webapi , udp 를 사용하는 원격 시스템 관리자 , 기본 rest 포트 20310, udp port 10020 을 사용한다.    

### 실행법

```bash
npm start

```

### api 명세

- sysinfo

시스템정보 얻기  
  
사용예 >  
```
http://localhost:3010/rest/sysinfo
```

#### 1. exec  

프로세스 실행하기 

/exec?cmd=명령어

ex)

```
http://localhost:2310/rest/exec?cmd=pwd  
http://localhost:2310/rest/exec?cmd=ls -al  
#볼륨조절
http://localhost:2310/rest/exec?cmd=amixer cset numid=1 100% 
#싸운드 테스트 
http://localhost:2310/rest/exec?cmd=speaker-test -t sine -f 440 -c 2 -s 1
#gpu 온도얻기 
http://localhost:20310/rest/exec?cmd=/opt/vc/bin/vcgencmd measure_temp
#cpu 온도얻기
http://localhost:20310/rest/exec?cmd=cat /sys/class/thermal/thermal_zone0/temp
``` 

#### 2. scanAp

/scanAp?interface=네트웍디바이스이름  

```
http://localhost:3010/scanAp?interface=wlan0
```

#### 3. setDate
시스템 시간 변경 함수, 내부 행망같은 인터넷 시각 서버에 접근할수없을때 가능  
/setDate?d=20190830&t=131003

시간 세팅 관련 참고자료  
https://raspberrypi.stackexchange.com/questions/76182/set-manually-datetime-raspberry

### 4. onoff rest-api gpio
```
http://localhost:3010/rest/onoff?pin=18&value=1  
```


### udp 를 통한 gpio 제어 

udp port  : 10020    

#### 1. 패킷 기본 형식

```js
let _packet = {
      c : 명령어,
      p : 핀번호,
      v : 값
    }
    
```

gpio 관련 명령어는 dw(digital write) 만 있다.  


#### 2. 포트에 값 쓰기 예제
```js
let _packet = {
      c : 'dw',
      p : pin,
      v : value
    }
```


 