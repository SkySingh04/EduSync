from flask import Flask, jsonify, request
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
import socket

app = Flask(__name__)
CORS(app)

import smtplib
from email.mime.text import MIMEText
import socket
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(r"C:\Users\USER\Desktop\classsnapv2-firebase-adminsdk-vhajc-13a82f347f.json")
firebase_admin.initialize_app(cred)

db=firestore.client()
socket.getaddrinfo('localhost',8080)
def draft_email(userId,data , decision=None,specifics=None,):
    print(userId)
    print(data)
    collection1=db.collection('users').stream()
    for i in collection1:
        if i.to_dict()['uid']==userId:
            sname=i.to_dict()['displayName']
            to_email=i.to_dict()['email']
            role=i.to_dict()['role']
            

     # Your email credentials
    if data==None: 
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
    elif data==None and decision==None:
        print("Enter the correct parameters")
    else:
        subject="Message !!!!"
        body=data
    sender_email = "enigmademo40@gmail.com"
    sender_password = 'lsxtqkajwahrvurq'

    # Create the MIMEText object for the email content
    msg = MIMEText(data)
    msg["Subject"] = subject
    msg["From"] = "enigmademo40@gmail.com"
    print(to_email)
    msg["To"] = to_email

    # Connect to the SMTP server (in this case, Gmail's SMTP server)
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        # Start the TLS connection
        server.starttls()

        # Login to your email account
        server.login(sender_email, sender_password)

        # Send the email
        server.sendmail(sender_email, to_email, msg.as_string())
    print("Message successfully sent")
    # Example usage

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json  # Assuming the request contains a JSON payload with necessary parameters
    userId = data.get('userId')
    email_data = data.get('data')

    # Call your existing draft_email function with the received parameters
    draft_email(userId, email_data)

    return jsonify({'message': 'Email sent successfully'}), 200
@app.route('/hi' ,methods=['GET'])
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(port=5000)  # Run the Flask app on port 5000 (you can change this as needed)
