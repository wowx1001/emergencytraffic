# 도로교통공단 인턴 과제 긴급교통정보 웹페이지

### 개발 목적
* 사용자가 사고, 공사, 행사 등과 관련된 긴급 교통정보 입력  
-> 쌓인 데이터는 기존 긴급교통정보 데이터와 병합되어 기관마다 다량의 데이터가 확보(지역 본부별 DB구축은 미완성)  

* 이후 저장된 데이터는 사용자가 필요한(긴급) 정보를 편리하게 관리 및 조회할 수 있도록 하나의 시스템으로 구축하였음.


## 1. 개발 환경 구성
- python3(flask 가상환경), mysql(or mariadb), 웹 서버(무료 아마존 ec2를 사용하였음)
#
## 2. 파일 구성
> 1) main.py : 서버 구동을 위한 파일
> 2) loginmysql.py : mysql/maraidb 로그인과 클라이언트의 요청으로 부터 서버의 데이터를 편집을 위한 모듈
> 3) static : 가상환경이 렌더링할 페이지의 css와 자바스크립트파일/ 이미지 모음
> 4) templates : flask 가상환경이 렌더링할 페이지
> 5) createdb.sql : DB 초기 세팅을 위해 스키마와 테이블을 생성하는 sql
> 6) requirements.txt : 파이썬 필요 라이브러리 정리 목록  
#
## 3. 서버 실행 단계
### ① python 또는 conda, mysql 설치
### ② 파이썬 파일 실행을 위해 요구된 라이브러리를 설치(requirements.txt에 정리되어있음) 명령어 : pip install -r 경로/requirements.txt
### ③ mysql 실행 뒤 콘솔 환경의 경우 source '경로/create.sql' 입력
### ④ https://apis.map.kakao.com/ 에서 카카오 맵 api 키 발급후 templates/main.html에 api키를 수정
### ⑤ https://developers.kakao.com/ -> 내 애플리케이션 -> 플랫폼 에서 애플리케이션을 추가하고 맨 아래에서 사이트 도메인에 자신의 아이피 주소와 포트를 추가.(ex.http://127.0.0.1:5000)
### ⑥ main.py의 host 부분을 자신의 고정 ip에 맞게 수정한 뒤 main.py을 실행
#
## 4. 실행 화면
### (홈)초기화면<br><img src="screenshot/초기화면.png"></img>
---------------------------------------------------------------
### 검색화면<br><img src="screenshot/검색 화면.png"></img>
---------------------------------------------------------------
### 검색화면 입력 폼(지도의 원하는 위치를 클릭하여 마커를 표시하고 입력할수있음)<br><img src="screenshot/검색 화면 - 입력.png"></img>
---------------------------------------------------------------
### 입력 후 결과를 테이블로 조회<br><img src="screenshot/입력 후 화면 - 조회.png"></img>
---------------------------------------------------------------
### 지역별 조회<br><img src="screenshot/지역 조회.png"></img>
---------------------------------------------------------------
### 지역별 조회 결과(지도)<br><img src="screenshot/조회 지역 결과.png"></img>
---------------------------------------------------------------
### 지역별 조회 결과(테이블)<br><img src="screenshot/조회 지역 결과 테이블 조회.png"></img>
---------------------------------------------------------------
### 교통정보표시/해제 (버튼을 다시 클릭 할 경우 숨기기)<br><img src="screenshot/교통정보 표시.png"></img>
---------------------------------------------------------------
### 우측 상단의 파일 아이콘을 클릭하여 파일 저장<br><img src="screenshot/파일 저장.png"></img>
---------------------------------------------------------------
### csv 저장 결과<br><img src="screenshot/csv 저장결과.png"></img>
