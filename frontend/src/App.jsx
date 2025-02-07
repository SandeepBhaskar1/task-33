// src/App.jsx
import React, { useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_BACKEND_CLOUD_URL || import.meta.env.VITE_BACKEND_LOCAL_URL;

function App() {
  const [cookieName, setCookieName] = useState('');
  const [cookieValue, setCookieValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSetCookie = async () => {
    try {
      const res = await fetch(`${API_URL}/cookie/set`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cookieName, value: cookieValue }),
      });
      console.log(API_URL)

      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleGetCookie = async () => {
    try {
      const res = await fetch(`${API_URL}/cookie/get/${cookieName}`, {
        credentials: 'include',
      });

      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleStatusDemo = async (statusCode) => {
    try {
      const res = await fetch(`${API_URL}/demo/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusCode }),
      });

      const data = await res.json();
      setResponse({ ...data, statusCode: res.status });
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cookie & HTTP Status Demo</h1>

      <div className="grid gap-8">
        {/* Cookie Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cookie Management</h2>
          <div className="grid gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Cookie Name"
                value={cookieName}
                onChange={(e) => setCookieName(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Cookie Value"
                value={cookieValue}
                onChange={(e) => setCookieValue(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSetCookie}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Set Cookie
              </button>
              <button
                onClick={handleGetCookie}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Get Cookie
              </button>
            </div>
          </div>
        </div>

        {/* HTTP Status Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">HTTP Status Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[200, 201, 400, 404, 500].map((code) => (
              <button
                key={code}
                onClick={() => handleStatusDemo(code)}
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 
                  ${code < 400 
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500' 
                    : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                  }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Response Display */}
        {(response || error) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Response</h2>
            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;