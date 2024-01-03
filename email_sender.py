import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
import socket
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from email.mime.application import MIMEApplication
cred = credentials.Certificate('your firebase config file')
firebase_admin.initialize_app(cred)

db=firestore.client()
socket.getaddrinfo('localhost',8080)
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
            print("hi")

            img_data=MIMEImage(f.read(),name=Imgdata)
            msg.attach(img_data)
            print(img_data)
            
            #img_data.attachment.add_header('Content-Disposition',f"attachment; filename= {Imgdata}")
            # image = MIMEImage(img_data, name=os.path.basename(Imgdata))
            
            
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
        
draft_email(userId='userid',Imgdata='image location')
