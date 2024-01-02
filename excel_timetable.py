import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import re

cred = credentials.Certificate('path to your firebase config file')
firebase_admin.initialize_app(cred)
db=firestore.client()

collection=db.collection("timeslots").stream()
collection1=db.collection('users').stream()
db=firestore.client()
def dump_data(teacherid,data):

    data1={}
    
    for i in collection1:
        
        data1[i.to_dict()['uid']]=i.to_dict()['displayName']
    
    data=data
    for i in data:
        time_day=i
        
        sid=data[i][1]
        class1=data[i][0]
        #print(time_day,sid,class1)
        students=[{"meetingLink":"","name":data1[sid],'studentId':sid,'subject':class1}]
        teachers=[{'name':data1[teacherid],'teacherId':teacherid}]
        document_id=time_day
        coll='timeslots'
        doc_ref=db.collection(coll).document(document_id)
        doc=doc_ref.get()
        if doc.exists:
            existing=doc.to_dict()
            existing['students']+=students
            existing['teachers']+=teachers
            doc_ref.set(existing)

        else:
            doc_ref.set({'students':students,'teachers':teachers})
        
    print("data updation successfull!!")
    



def createtimetablefromexcel(path,userId):
    df = pd.read_excel(path, sheet_name='Sheet1') 
    
    L=['Monday-9:00 AM', 'Monday-10:00 AM', 'Monday-11:00 AM', 'Monday-12:00 PM', 'Monday-1:00 PM', 'Monday-2:00 PM', 'Monday-3:00 PM', 'Monday-4:00 PM', 'Tuesday-9:00 AM', 'Tuesday-10:00 AM', 'Tuesday-11:00 AM', 'Tuesday-12:00 PM', 'Tuesday-1:00 PM', 'Tuesday-2:00 PM', 'Tuesday-3:00 PM', 'Tuesday-4:00 PM', 'Wednesday-9:00 AM', 'Wednesday-10:00 AM', 'Wednesday-11:00 AM', 'Wednesday-12:00 PM', 'Wednesday-1:00 PM', 'Wednesday-2:00 PM', 'Wednesday-3:00 PM', 'Wednesday-4:00 PM', 'Thursday-9:00 AM', 'Thursday-10:00 AM', 'Thursday-11:00 AM', 'Thursday-12:00 PM', 'Thursday-1:00 PM', 'Thursday-2:00 PM', 'Thursday-3:00 PM', 'Thursday-4:00 PM', 'Friday-9:00 AM', 'Friday-10:00 AM', 'Friday-11:00 AM', 'Friday-12:00 PM', 'Friday-1:00 PM', 'Friday-2:00 PM', 'Friday-3:00 PM', 'Friday-4:00 PM']
    
    a=["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"]
    z=[]
    ab={}
    
    for i in range(5):
        for b in a:
            
            z+=[df[b][i]]
            
    
    for i in range(len(L)):
        try:
            ab[L[i]]=tuple(z[i].split('/'))
        except:
            ab[L[i]]=z[i]
    ab1=pd.Series(ab)
    ab1= {key: value for key, value in ab1.items() if not pd.isna(value)}
    
    dump_data(userId,ab1)
    
    
createtimetablefromexcel('path_to_excel_sheet','teachers_id') 



