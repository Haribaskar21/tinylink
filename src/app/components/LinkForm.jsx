import { useState } from 'react';

export default function LinkForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError('Code must be alphanumeric and 6 to 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || generateCode() }),
      });
      if (res.status === 409) {
        setError('Code already exists');
      } else if (res.ok) {
        const data = await res.json();
        onAdd(data);
        setUrl('');
        setCode('');
        setSuccess('Link added successfully!');
      } else {
        setError('Something went wrong');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }

  // Generates random 6 char alphanumeric code
  function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl mb-6 max-w-lg mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create a Short Link</h2>

      <div className="mb-5">
        <label className="block font-semibold mb-2 text-gray-700">Long URL</label>
        <input
          type="url"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          placeholder="https://example.com/long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="mb-5">
        <label className="block font-semibold mb-2 text-gray-700">Custom Code (optional)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          placeholder="6-8 letters or numbers"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          maxLength={30}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-lg transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Create Short Link'}
      </button>

      {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
      {success && <p className="mt-4 text-center text-green-600 font-medium">{success}</p>}
    </form>
  );
}
