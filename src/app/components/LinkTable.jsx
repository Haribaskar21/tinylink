import { useState } from 'react';
import { formatIST } from '../../lib/formatTime';

export default function LinkTable({ links, onDelete, onRefresh, loading }) {
  const [filter, setFilter] = useState('');

  // Filter links by code or URL
  const filteredLinks = links.filter(link => {
    const search = filter.toLowerCase();
    return link.code.toLowerCase().includes(search) || link.url.toLowerCase().includes(search);
  });

  // Copy full URL to clipboard
  const copyToClipboard = (code) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => alert(`Copied: ${fullUrl}`))
      .catch(() => alert('Failed to copy'));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Links</h2>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by code or URL"
        className="mb-6 p-3 border border-gray-300 rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Links Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="p-4 text-left uppercase tracking-wider">Short Code</th>
              <th className="p-4 text-left uppercase tracking-wider">Target URL</th>
              <th className="p-4 text-left uppercase tracking-wider">Clicks</th>
              <th className="p-4 text-left uppercase tracking-wider">Last Clicked</th>
              <th className="p-4 text-left uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show loading state */}
            {loading && links.length === 0 && (
              <tr className="bg-gray-100">
                <td colSpan="5" className="text-center p-6 text-gray-500 italic">
                  Loading links...
                </td>
              </tr>
            )}

            {/* Show no results if filtered is empty */}
            {!loading && filteredLinks.length === 0 && (
              <tr className="bg-gray-100">
                <td colSpan="5" className="text-center p-6 text-gray-500 italic">
                  No links found
                </td>
              </tr>
            )}

            {/* Map over filtered links */}
            {!loading && filteredLinks.map(({ code, url, click_count, last_clicked }) => (
              <tr key={code} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-blue-600 flex items-center gap-2">
                  <a href={`/${code}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {code}
                  </a>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm transition"
                  >
                    Copy
                  </button>
                </td>
                <td className="p-4 truncate max-w-xs" title={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-700">
                    {url.length > 50 ? url.slice(0, 47) + '...' : url}
                  </a>
                </td>
                <td className="p-4 font-medium text-gray-800">{click_count}</td>
                <td className="p-4 text-gray-600">{formatIST(last_clicked)}</td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete link "${code}"?`)) onDelete(code);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
