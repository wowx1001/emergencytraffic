import json
from django.core.serializers.json import DjangoJSONEncoder
import pandas as pd
import time

# 데이터 입력 요청시 DB에 데이터를 삽입하는 부분
def insert_data(reqs,db,cs):
    sql = """insert into inp_table(accid_type, reception_date, reception_time, region, accident_contents, lat, lng) 
    values('%s',curdate() ,'%s','%s','%s', %f, %f);"""%(
        str(reqs['accid_type']),
        str(time.strftime('%H:%M')),
        str(reqs['loc']),
        str(reqs['accident_contents']),
        float(reqs['lat']),
        float(reqs['lng']))
    cs.execute(sql)
    db.commit()

# 데이터 조회 요청시 조회 테이블의 데이터를 반환
def select_data(regs, cs):
    if regs['sigugun']=="":
        sql = """select accid_type,reception_date,reception_time,accident_contents,region,reception_viewpoint,from_direction,to_direction,lane,lat,lng 
        from newtest,hangjeong 
        where (region=left(hangjeong.sigungu,2)) and sido='%s' and accid_type='%s'""" % (str(regs['sido']), str(regs['accid_type']))
        sql += (str(regs['reception_time']))
        sql += (str(regs['reception_date']))
    else:
        sql = """select accid_type,reception_date,reception_time,accident_contents,region,reception_viewpoint,from_direction,to_direction,lane,lat,lng 
        from newtest 
        where region='%s' and accid_type='%s'"""%(str(regs['sigugun']),str(regs['accid_type']))
        sql += (str(regs['reception_time']))
        sql += (str(regs['reception_date']))
    print(sql)
    cs.execute(sql)
    result = json.dumps(cs.fetchall(), cls=DjangoJSONEncoder, ensure_ascii=False)
    return result

# 입력 데이터 조회 요청시 입력 데이터 테이블의 데이터를 반환
def inp_select_data(cs):
    sql = "select * from inp_table;"
    cs.execute(sql)
    result = json.dumps(cs.fetchall(), cls=DjangoJSONEncoder, ensure_ascii=False)

    return result

# 저장 아이콘 클릭 시 데이터프레임의 형태로 반환
def download_data(cs):
    sql ="""select * from newtest;"""
    cs.execute(sql)
    cs_dump = cs.fetchall()
    result = pd.DataFrame(cs_dump)
    return result