import React, { useState, useEffect } from "react";

// Main App component for the traffic dashboard.
// It fetches real-time data from the Flask backend.
export default function App() {
  // Use a state to hold the dashboard data.
  const [dashboardData, setDashboardData] = useState({
    signals: [],
    queueLengths: [],
    agentPerformance: {
      reward: 0,
      episodes: 0,
      metrics: [],
    },
    alerts: [],
  });

  // Fetch real-time data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Change the URL to '/detect' to match the backend endpoint.
        const response = await fetch('http://127.0.0.1:5000/detect'); 
        if (!response.ok) throw new Error('Failed to fetch data from backend');
        const data = await response.json();
        setDashboardData(data); // update state with backend data
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 2000); // fetch every 2 seconds

    return () => clearInterval(interval); // cleanup interval on unmount
  }, []);

  // helper for signal color
  const getSignalColor = (status) => {
    switch (status) {
      case 'Green': return 'bg-emerald-500';
      case 'Yellow': return 'bg-amber-500';
      case 'Red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6 md:p-10">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center">
          <svg className="w-12 h-12 text-emerald-400 mr-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8A.5.5 0 015.5 8zM5.5 12a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z" />
          </svg>
          <h1 className="text-3xl md:text-5xl font-extrabold">Smart Traffic Dashboard</h1>
        </div>
        <p className="mt-4 md:mt-0 text-gray-400">Real-time monitoring of adaptive traffic signal system.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Signals */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">Signal Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.signals.map(signal => (
              <div key={signal.id} className="bg-gray-700 rounded-xl p-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Intersection {signal.id}</h3>
                  <p className="text-gray-400 text-sm">Cars Passed: {signal.carsPassed}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`w-8 h-8 rounded-full ${getSignalColor(signal.status)} border-2 border-white`} />
                  <p className="text-sm mt-1">{signal.status} for {signal.duration}s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RL Agent */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">RL Agent Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between bg-gray-700 rounded-xl p-4">
              <span>Total Reward:</span>
              <span className="text-2xl font-bold text-green-400">{dashboardData.agentPerformance.reward}</span>
            </div>
            <div className="flex justify-between bg-gray-700 rounded-xl p-4">
              <span>Episodes:</span>
              <span className="text-2xl font-bold">{dashboardData.agentPerformance.episodes}</span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg mb-2">Reward History</h3>
            <svg viewBox="0 0 100 20" className="w-full h-auto">
              <polyline
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.5"
                points={dashboardData.agentPerformance.metrics.map((val, i) => `${i * 6.25},${20 - (val - 80) / 2}`).join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Queue Lengths */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">Queue Lengths</h2>
          {dashboardData.queueLengths.map(queue => (
            <div key={queue.id} className="bg-gray-700 rounded-xl p-4 mb-3">
              <div className="flex justify-between">
                <span>Intersection {queue.id}</span>
                <span className="text-2xl font-bold">{queue.length}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-sky-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (queue.length / 30) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-emerald-300">Live Traffic Map</h2>
          <div className="w-full h-96 bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 font-bold">
            Mapbox Map Here
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-3 bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-red-400">System Alerts</h2>
          {dashboardData.alerts.length > 0 ? (
            dashboardData.alerts.map((alert, i) => (
              <div key={i} className="bg-red-900 p-3 rounded-xl mb-2">
                <p className="font-semibold">{alert.message}</p>
                <p className="text-xs">{alert.timestamp}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No active alerts.</p>
          )}
        </div>

      </main>
    </div>
  );
}
