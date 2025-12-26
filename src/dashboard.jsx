import React, { useState, useEffect } from 'react';

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
        // Change the URL to 'http://127.0.0.1:5000/detect' to match the backend endpoint.
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

  // Utility function to get a Tailwind color based on signal status.
  const getSignalColor = (status) => {
    switch (status) {
      case 'Green':
        return 'bg-emerald-500';
      case 'Yellow':
        return 'bg-amber-500';
      case 'Red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-6 md:p-10">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center">
          <svg className="w-12 h-12 text-teal-400 mr-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8A.5.5 0 015.5 8zM5.5 12a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z" />
          </svg>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">Smart Traffic Dashboard</h1>
        </div>
        <div className="mt-4 md:mt-0 text-gray-400 text-sm md:text-base">
          <p>Real-time monitoring of adaptive traffic signal system.</p>
        </div>
      </header>
      
      {/* Grid container for the main dashboard content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Card for Signal Status */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-teal-400">Signal Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.signals.map(signal => (
              <div key={signal.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-gray-600">
                <div>
                  <h3 className="text-lg font-semibold">{`Intersection ${signal.id}`}</h3>
                  <p className="text-gray-400 text-sm">Cars Passed: {signal.carsPassed}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`w-8 h-8 rounded-full ${getSignalColor(signal.status)} border-2 border-white`}></div>
                  <p className="text-sm font-medium mt-1">{signal.status} for {signal.duration}s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card for RL Agent Performance */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-teal-400">RL Agent Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800 rounded-xl p-4 border border-gray-600">
              <span className="text-gray-400">Total Reward:</span>
              <span className="text-2xl font-bold text-lime-400">{dashboardData.agentPerformance.reward}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 rounded-xl p-4 border border-gray-600">
              <span className="text-gray-400">Episodes Trained:</span>
              <span className="text-2xl font-bold">{dashboardData.agentPerformance.episodes}</span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Reward History (D3.js would go here)</h3>
            <div className="bg-slate-800 rounded-xl p-4">
              <svg viewBox="0 0 100 20" className="w-full h-auto">
                <polyline 
                  fill="none" 
                  stroke="#a7e634" 
                  strokeWidth="1.5" 
                  points={dashboardData.agentPerformance.metrics.map((val, i) => `${i * 6.25},${20 - (val - 80) / 2}`).join(' ')} 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card for Queue Lengths */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-teal-400">Queue Lengths</h2>
          <div className="space-y-4">
            {dashboardData.queueLengths.map(queue => (
              <div key={queue.id} className="bg-slate-800 rounded-xl p-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Intersection {queue.id}:</span>
                  <span className="text-2xl font-bold">{queue.length} vehicles</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, (queue.length / 30) * 100)}%` }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card for Live Traffic Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl flex flex-col items-center justify-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-teal-400">Live Traffic Map</h2>
          <div className="w-full h-96 bg-slate-800 rounded-xl flex items-center justify-center text-gray-500 font-bold text-center border border-gray-600">
            Live Traffic Map (Mapbox GL JS would go here)
          </div>
          <p className="mt-4 text-gray-400 text-sm text-center">
            This area is a placeholder for a real-time map visualization, which can be implemented using a library like Mapbox.
          </p>
        </div>
        
        {/* Card for Alerts */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-400">System Alerts</h2>
          {dashboardData.alerts.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.alerts.map((alert, index) => (
                <div key={index} className="bg-red-900 bg-opacity-30 border border-red-800 rounded-xl p-3 flex items-start">
                  <svg className="w-6 h-6 text-red-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.51a.75.75 0 011.486 0l4.5 9A.75.75 0 0113 13.75H7a.75.75 0 01-.743-1.24l4.5-9z" clipRule="evenodd"></path>
                  </svg>
                  <div>
                    <p className="font-semibold text-red-200">{alert.message}</p>
                    <p className="text-xs text-red-300">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No active alerts.</p>
          )}
        </div>
      </main>
    </div>
  );
}
