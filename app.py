from flask import Flask, render_template, request, jsonify
from datetime import datetime
import mysql.connector

app = Flask(__name__)

# Function to connect to the MySQL database
def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",         # Replace with your MySQL username
        password="2046",     # Replace with your MySQL password
        database="railwayreservation"
    )
    return connection

@app.route('/')
def index():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch stations from the database
    cursor.execute("SELECT StationID, StationName FROM Station")
    stations = cursor.fetchall()

    conn.close()
    return render_template('index.html', stations=stations)


# User Registration Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO User (Username, Password, Email) VALUES (%s, %s, %s)", (username, password, email))
    conn.commit()

    conn.close()
    return jsonify({'success': True, 'message': 'User registered successfully!'})

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT UserID, Password FROM User WHERE Username = %s", (username,))
    user = cursor.fetchone()

    if user and user[1] == password:  # Check if password matches
        cursor.execute("INSERT INTO Login (UserID) VALUES (%s)", (user[0],))  # Log the login time
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'user_id': user[0]})
    else:
        conn.close()
        return jsonify({'success': False, 'message': 'Invalid username or password'})

# Ticket Booking Route
@app.route('/book_ticket', methods=['POST'])
def book_ticket():
    data = request.get_json()
    name = data['name']
    contact = data['contact']
    age = data['age']
    train_id = data['trainId']

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into Customer table
        cursor.execute("INSERT INTO Customer (Name, Contact, Age) VALUES (%s, %s, %s)", (name, contact, age))
        conn.commit()

        # Get last inserted CustomerID
        customer_id = cursor.lastrowid

        # Insert into Ticket table
        today = datetime.now().date()
        cursor.execute("INSERT INTO Ticket (CustomerID, Date, Train_ID) VALUES (%s, %s, %s)",
                       (customer_id, today, train_id))
        conn.commit()

        conn.close()

        return jsonify({"success": True})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"success": False, "message": str(e)})

if __name__ == '__main__':
    print("Flask server starting...")
    app.run(debug=True)
