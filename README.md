# 도로교통공단 인턴 과제 긴급교통정보 웹페이지


### 1. 개발 환경 구성
- python3, mysql(or mariadb), 웹 서버(무료 아마존 ec2를 사용하였음)
#
### 2. 파일 구성
> 1) main.py : 서버 구동을 위한 파일
> 2) loginmysql.py : mysql/maraidb 로그인과 클라이언트의 요청으로 부터 서버의 데이터를 편집을 위한 모듈
> 3) static : 가상환경이 렌더링할 페이지의 css와 자바스크립트파일/ 이미지 모음
> 4) templates : flask 가상환경이 렌더링할 페이지
> 5) createdb.sql : DB 초기 세팅을 위해 스키마와 테이블을 생성하는 sql
> 6) requirements.txt : 파이썬 필요 라이브러리 정리 목록  
#
### 3. 서버 실행 단계
#### ① python 또는 conda, mysql 설치
#### ② 파이썬 파일 실행을 위해 요구된 라이브러리를 설치(requirements.txt에 정리되어있음) 명령어 : pip install -r 경로/requirements.txt
#### ③ mysql 실행 뒤 콘솔 환경의 경우 source '경로/create.sql' 입력
#### ④ main.py의 host 부분을 자신의 고정 ip에 맞게 수정한 뒤 main.py을 실행
#
### 4. 실행 화면
