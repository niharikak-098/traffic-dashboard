Traffic Dashboard
A comprehensive dashboard for traffic analysis, simulation, and visualization using modern technologies.
Features
Real-time traffic data visualization.
Traffic simulation and predictive analysis.
Interactive charts and maps for traffic trends.
Backend API for data processing and streaming.
Containerized setup for easy deployment.
| Category                 | Technologies / Tools Used                |
| ------------------------ | ---------------------------------------- |
| Machine Learning & CV    | Python, TensorFlow/PyTorch, OpenCV, YOLO |
| Simulation               | SUMO (Simulation of Urban Mobility)      |
| Backend & API            | FastAPI                                  |
| Data & Streaming         | Apache Kafka, PostgreSQL                 |
| Frontend & Visualization | React.js, D3.js, Mapbox                  |
| DevOps & Version Control | Docker, Git                              |
How to Run

Clone the repository:

git clone https://github.com/niharikak-098/traffic-dashboard.git


Navigate to project folder:

cd traffic-dashboard


Install dependencies (Python packages, Node.js packages, etc.):

pip install -r requirements.txt
npm install


Start backend server (FastAPI):

uvicorn app:app --reload


Start frontend (React.js):

npm start


Open your browser and go to:

http://localhost:3000

Project Structure
traffic-dashboard/
│
├─ backend/               # FastAPI backend code
├─ frontend/              # React.js frontend code
├─ data/                  # CSV / database files
├─ simulations/           # SUMO traffic simulations
├─ Dockerfile             # Container setup
├─ docker-compose.yml     # Docker services
├─ README.md              # Project documentation
├─ requirements.txt       # Python dependencies
└─ package.json           # Node.js dependencies

Author
Niharika K. (Mitra)
GitHub: https://github.com/niharikak-098
