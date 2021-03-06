from io import StringIO
from flask import Flask,request, render_template,Response
import flask_jsonpify
import loginmysql
import pymysql

# db 접속정보 및 접속(자신의 DB정보에 맞게 수정되어야 함)
demo_db = pymysql.connect(
    user='root',
    passwd='1111',
    host='0.0.0.0',
    db='demo',
    charset='utf8'
)
cursor = demo_db.cursor(pymysql.cursors.DictCursor)
app = Flask(__name__)

# 메인 페이지 렌더링
@app.route("/")
def index():
    return render_template('main.html')

# 데이터를 입력하는 요청을 받는 부분
@app.route('/req', methods=['POST'])
def req():
    data = request.get_json()

    loginmysql.insert_data(data, demo_db, cursor)
    return flask_jsonpify.jsonify(result=data)

# 데이터를 조회하는 요청을 받는 부분
@app.route('/region_inquiry', methods=['POST'])
def region_inquiry():
    data = request.get_json()
    inqreq = loginmysql.select_data(data, cursor)

    return inqreq

# 데이터를 저장하는 요청을 받는 부분
@app.route('/save_csv', methods=['POST'])
def save_csv():
    output_stream = StringIO()
    temp_df = loginmysql.download_data(cursor)
    temp_df.to_csv(output_stream)
    response = Response(
        output_stream.getvalue(),
        mimetype='text/csv',
        content_type='application/octet-stream',
    )
    response.headers["Content-Disposition"] = "attachment; filename=post_export.csv"
    return response

@app.route('/refresh_input', methods=['POST'])
def refresh_input():
    allinp = loginmysql.inp_select_data(cursor)
    return allinp

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True, threaded=True, port=5000) #원하는 포트&아이피 주소를 port, host에 바꿔 기재

