from flask import Flask, jsonify, request
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
import socket
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
app = Flask(__name__)
CORS(app)
import pandas as pd
import smtplib
from email.mime.text import MIMEText
import socket
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(r"C:\Users\USER\Desktop\classsnapv2-firebase-adminsdk-vhajc-13a82f347f.json")
firebase_admin.initialize_app(cred)

db=firestore.client()
collection1=db.collection('users').stream()
socket.getaddrinfo('localhost',8080)
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
def draft_email(userId,decision=None,specifics=None,data=None,Imgdata=None):
    collection1=db.collection('users').stream()
    found=False
    for i in collection1:
        
        if i.to_dict()['uid']==userId:
            sname=i.to_dict()['displayName']
            to_email=i.to_dict()['email']
            role=i.to_dict()['role']
            print(role,sname,to_email)
            found=True
            break
    if not found:
        print("UserId invalid")
        return None
            

     # Your email credentials
    subject=''
    body=''
    if data==None and decision!=None and Imgdata!=None: 
        if decision=='reschedule' and role=='student':
            subject='Reschedule requested by the student'
            body="The student with Student name "+sname+' with student id '+'has requested to reschedule the class to '+ specifics+" This is a system generated email Dont reply!!"
        elif decision=="reschedule" and role=='teacher':
            subject='Class rescheduled'
            body="The teacher "+'has requested to reschedule the class to '+ specifics+". This is a system generated email. Dont reply!!"

        elif decision=="cancel" and role=='student':
            subject="Class Cancellation request"
            body="The student with Student name "+sname+' with student id '+'has requested to cancel the class '+" This is a system generated email Dont reply!!"
        
        elif decision=="cancel" and role=="teacher":
            subject="Class stands cancelled"
            body="The class has been cancelled by the teacher"+" This is a system generated email Dont reply!!"
    elif data==None and decision==None and Imgdata!=None:
        subject="Message!!!"
        body="This is a system generated message"
    else:
        print("Incorrect parameters")
        return None
    print(subject)


   
    msg=MIMEMultipart()
    sender_email = "enigmademo40@gmail.com"
    sender_password = 'lsxtqkajwahrvurq'
    msg["Subject"] = subject
    msg["From"] = "enigmademo40@gmail.com"
    msg["To"] = to_email#to_email
    # Create the MIMEText object for the email content
   
    
    
    body=MIMEText(body)
    msg.attach(body)
    try:
        with open(Imgdata,'rb') as f:
            

            img_data=MIMEImage(f.read(),name=Imgdata)
            msg.attach(img_data)         
            
    except:
        pass
   



    # Connect to the SMTP server (in this case, Gmail's SMTP server)
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        # Start the TLS connection
        server.ehlo()

        server.starttls()
        server.ehlo()
        # Login to your email account
        server.login(sender_email, sender_password)

        # Send the email
        server.sendmail(sender_email,to_email, msg.as_string())
        server.quit()#to_email,
    print("Message successfully sent")
    # Example usage
@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json  # Assuming the request contains a JSON payload with necessary parameters
    userId = data.get('userId')
    email_data = data.get('data')
    # Img_data is to be given @Akash
    # decision vgerah bhi dene @Akash
    # Call your existing draft_email function with the received parameters
    draft_email(userId=userId, data=email_data)

    return jsonify({'message': 'Email sent successfully'}), 200
@app.route('/hi' ,methods=['GET'])
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(port=5000)  # Run the Flask app on port 5000 (you can change this as needed)
