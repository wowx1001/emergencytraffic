from io import StringIO
from flask import Flask,request, render_template,Response
import flask_jsonpify
import loginmysql
import pymysql


demo_db = pymysql.connect(
    user='root',
    passwd='1111',
    host='0.0.0.0',
    db='demo',
    charset='utf8'
)
cursor = demo_db.cursor(pymysql.cursors.DictCursor)
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('main.html')


@app.route('/req', methods=['POST'])
def req():
    data = request.get_json()

    loginmysql.insert_data(data, demo_db, cursor)

    return flask_jsonpify.jsonify(result=data)

@app.route('/region_inquiry', methods=['POST'])
def region_inquiry():
    data = request.get_json()
    inqreq = loginmysql.select_data(data, cursor)
    return inqreq

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True, port=5000)

