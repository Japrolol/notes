import os
from datetime import timedelta

from flask import Flask, redirect, jsonify, make_response, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, current_user
from flask_cors import CORS
import mariadb
import dotenv
import bcrypt as bc
app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://192.168.5.193:5173'], supports_credentials=True)
jwt = JWTManager(app)
dotenv.load_dotenv()
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_SECRET_KEY'] =os.getenv('SECRET_KEY')


def db_conn():
    try:
        conn = mariadb.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            port=int(os.getenv('DB_PORT')),
            db=os.getenv('DB_NAME'),
            password=os.getenv('DB_PASSWORD')
        )
        return conn
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        raise

@app.route('/')
def hello_world():
    return redirect('http://localhost:5173')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    conn = None
    try:
        conn = db_conn()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
            row = cursor.fetchone()
            if row:
                print(f"Database hash: {row[3]}")
                password_match = bc.checkpw(password.encode('utf-8'), row[3].encode('utf-8'))
                print(f"Password match: {password_match}")

                if password_match:
                    access_token = create_access_token(identity=row[0])
                    print(f"Access token created: {access_token}")
                    response = make_response(jsonify({"message": "Login successful"}))
                    response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='Strict')
                    print("Cookie set in response")
                    return response, 200
                else:
                    print("Password did not match")
                    return jsonify({"message": "Invalid credentials"}), 401
            else:
                print("Email not found")
                return jsonify({"message": "Invalid credentials"}), 401
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        if conn is not None:
            conn.close()

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    response = make_response(jsonify({"message": "Logout successful"}))
    response.delete_cookie('access_token')
    return response, 200

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def user():
    current_user = get_jwt_identity()
    conn = None
    try:
        conn = db_conn()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM user WHERE id = %s", (current_user,))
            row = cursor.fetchone()
            if row:
                return jsonify({"username": row[1], "email": row[2]}), 200
            else:
                return jsonify({"message": "User not found"}), 404
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)