from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Mdsaad@3704",
    database="UniCollab"
)
cursor = db.cursor(dictionary=True)

# @app.route("/api/students", methods=["GET"])
# def get_students():
#     cursor.execute("SELECT id, name, email FROM students")
#     return jsonify(cursor.fetchall())

@app.route("/api/students", methods=["GET"])
def get_students():
    # dummy test
    return jsonify([{"id":1,"name":"Saad","email":"saad@example.com"}])


# Optional: /api/projects
@app.route("/api/projects", methods=["GET"])
def get_projects():
    cursor.execute("SELECT id, title, description, author, tags FROM projects")
    projects = cursor.fetchall()
    for p in projects:
        if isinstance(p.get("tags"), str):
            p["tags"] = p["tags"].split(",")
    return jsonify({"projects": projects})

# -----------------------
# Socket.IO Events
# -----------------------

# Example event
@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("join_room")
def handle_join(data):
    room = f"{min(data['from'], data['to'])}_{max(data['from'], data['to'])}"
    join_room(room)
    print(f"User {data['from']} joined room {room}")

@socketio.on("send_message")
def handle_message(data):
    room = f"{min(data['from'], data['to'])}_{max(data['from'], data['to'])}"
    
    # Save message to database
    insert_query = """
        INSERT INTO messages (sender_id, receiver_id, message)
        VALUES (%s, %s, %s)
    """
    cursor.execute(insert_query, (data["from"], data["to"], data["text"]))
    db.commit()
    
    msg = {
        "from": data["from"],
        "to": data["to"],
        "text": data["text"],
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    emit("receive_message", msg, room=room)

# -----------------------
# Run App
# -----------------------
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

