import { useState } from 'react';
import { formatIST } from '../../lib/formatTime'; // ✅ already imported

export default function LinkTable({ links, onDelete }) {
  const [filter, setFilter] = useState('');

  let filteredLinks = links.filter((link) => {
    const search = filter.toLowerCase();
    return (
      link.code.toLowerCase().includes(search) || 
      link.url.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by code or URL"
        className="mb-4 p-2 border rounded w-full max-w-md"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Short Code</th>
              <th className="p-3 text-left">Target URL</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Last Clicked</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-600">
                  No links found
                </td>
              </tr>
            )}
            {filteredLinks.map(({ code, url, click_count, last_clicked }) => (
              <tr key={code} className="border-t">
                <td className="p-3 font-mono text-blue-600">
                  <a href={`/${code}`} target="_blank" rel="noopener noreferrer">
                    {code}
                  </a>
                </td>
                <td className="p-3 truncate max-w-xs" title={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {url.length > 50 ? url.slice(0, 47) + '...' : url}
                  </a>
                </td>
                <td className="p-3">{click_count}</td>
                <td className="p-3">{formatIST(last_clicked)}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete link "${code}"?`)) onDelete(code);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
