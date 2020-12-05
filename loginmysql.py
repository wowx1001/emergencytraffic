import json
from django.core.serializers.json import DjangoJSONEncoder
import pandas as pd
import time

def insert_data(reqs,db,cs):
    sql = """insert into inp_table(reception_date, reception_time, region, accident_contents, lat, lng) 
    values(curdate() ,'%s','%s','%s', %f, %f);"""%(
        str(time.strftime('%H:%M')),
        str(reqs['loc']),
        str(reqs['accident_contents']),
        float(reqs['lat']),
        float(reqs['lng']))
    cs.execute(sql)
    db.commit()

def select_data(regs, cs):
    if regs['sigugun']=="":
        sql = """select accid_type,reception_date,reception_time,accident_contents,region,reception_viewpoint,from_direction,to_direction,lane,lat,lng 
        from newtest,hangjeong 
        where (region=left(hangjeong.sigungu,2)) and sido='%s' and accid_type='%s';""" % (str(regs['sido']), str(regs['accid_type']))
    else:
        sql = """select accid_type,reception_date,reception_time,accident_contents,region,reception_viewpoint,from_direction,to_direction,lane,lat,lng 
        from newtest 
        where region='%s' and accid_type='%s';"""%(str(regs['sigugun']),str(regs['accid_type']))
    cs.execute(sql)
    result = json.dumps(cs.fetchall(), cls=DjangoJSONEncoder, ensure_ascii=False)
    return result

def download_data(cs):
    sql ="""select * from newtest;"""
    cs.execute(sql)
    cs_dump = cs.fetchall()
    result = pd.DataFrame(cs_dump)
    return result