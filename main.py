from flask import Flask, render_template, redirect, jsonify
from flask import url_for, session, request, flash
from datetime import timedelta
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app) #initialize bcrypt hashing in app

#get app secret key
with open("secret.env") as p:
    secret = p.read()

app.secret_key = secret
app.permanent_session_lifetime = timedelta(minutes=45)

@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug = True)