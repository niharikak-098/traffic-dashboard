from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

# Create a Flask app instance.
app = Flask(__name__)
# Allow frontend calls from localhost:5173
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Main route to serve the app.
@app.route("/")
def home():
    """
    Health check route for the backend.
    """
    return "Backend is running!"

@app.route("/detect", methods=["GET"])
def detect():
    """
    Generates and returns dummy real-time traffic data.
    This simulates a traffic detection system.
    """
    signals = [
        {"id": "1", "status": "Green", "duration": random.randint(20, 60), "carsPassed": random.randint(100, 500)},
        {"id": "2", "status": "Yellow", "duration": 5, "carsPassed": random.randint(100, 500)},
        {"id": "3", "status": "Red", "duration": random.randint(20, 60), "carsPassed": random.randint(100, 500)},
    ]
    
    queue_lengths = [
        {"id": "1", "length": random.randint(5, 40)},
        {"id": "2", "length": random.randint(5, 40)},
        {"id": "3", "length": random.randint(5, 40)},
    ]
    
    agent_performance = {
        "reward": random.uniform(80, 100),
        "episodes": random.randint(100, 500),
        "metrics": [random.uniform(80, 100) for _ in range(16)], # Dummy metrics for chart
    }
    
    # Generate a random alert to simulate real-world conditions
    alerts = []
    if random.random() < 0.2:
        alerts.append({
            "message": "High congestion alert at intersection {}!".format(random.randint(1,3)),
            "timestamp": time.strftime("%H:%M:%S")
        })

    data = {
        "signals": signals,
        "queueLengths": queue_lengths,
        "agentPerformance": agent_performance,
        "alerts": alerts,
    }
    
    return jsonify(data)

if __name__ == '__main__':
    # Run the app on host 127.0.0.1 and port 5000.
    app.run(host='127.0.0.1', port=5000, debug=True)
