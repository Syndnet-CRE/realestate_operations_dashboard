import React, { useState } from 'react';
import { GitCommit, User, Calendar, Hash, ChevronRight, FileText, Copy, Check } from 'lucide-react';

const CommitHistory = () => {
  const [expandedCommit, setExpandedCommit] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  // Mock commit data
  const commits = [
    {
      hash: 'e7a7028',
      fullHash: 'e7a7028a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8',
      message: 'Latest code updated',
      description: 'Updated all components with latest features and bug fixes',
      author: 'John Developer',
      authorAvatar: 'JD',
      date: '2 hours ago',
      timestamp: '2025-11-10 14:30:00',
      filesChanged: 8,
      additions: 145,
      deletions: 23,
      files: [
        { name: 'src/App.jsx', additions: 45, deletions: 12 },
        { name: 'src/components/Header.jsx', additions: 23, deletions: 5 },
        { name: 'README.md', additions: 77, deletions: 6 }
      ]
    },
    {
      hash: 'e837c5e',
      fullHash: 'e837c5e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6',
      message: 'Initial commit with README',
      description: 'Added comprehensive README with project documentation',
      author: 'Jane Smith',
      authorAvatar: 'JS',
      date: '2 days ago',
      timestamp: '2025-11-08 10:15:00',
      filesChanged: 5,
      additions: 234,
      deletions: 0,
      files: [
        { name: 'README.md', additions: 108, deletions: 0 },
        { name: 'package.json', additions: 65, deletions: 0 },
        { name: '.gitignore', additions: 61, deletions: 0 }
      ]
    },
    {
      hash: 'a1b2c3d',
      fullHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9',
      message: 'Add responsive design improvements',
      description: 'Improved mobile responsiveness across all pages',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      date: '3 days ago',
      timestamp: '2025-11-07 16:45:00',
      filesChanged: 12,
      additions: 267,
      deletions: 89,
      files: [
        { name: 'src/styles/globals.css', additions: 123, deletions: 45 },
        { name: 'tailwind.config.js', additions: 89, deletions: 23 }
      ]
    },
    {
      hash: 'f4e5d6c',
      fullHash: 'f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1',
      message: 'Implement dark mode feature',
      description: 'Added dark mode toggle with theme persistence',
      author: 'Sarah Williams',
      authorAvatar: 'SW',
      date: '1 week ago',
      timestamp: '2025-11-03 11:20:00',
      filesChanged: 15,
      additions: 412,
      deletions: 67,
      files: [
        { name: 'src/contexts/ThemeContext.jsx', additions: 156, deletions: 0 },
        { name: 'src/hooks/useTheme.js', additions: 78, deletions: 0 }
      ]
    }
  ];

  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-indigo-600" />
            <span>Commit History</span>
          </h2>
          <span className="text-sm text-slate-600">
            {commits.length} commits
          </span>
        </div>
      </div>

      {/* Commits List */}
      <div className="space-y-3">
        {commits.map((commit, index) => (
          <div
            key={commit.hash}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Commit Header */}
            <div className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Author Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {commit.authorAvatar}
                  </div>

                  {/* Commit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {commit.message}
                      </h3>
                    </div>
                    {commit.description && (
                      <p className="text-sm text-slate-600 mb-2">
                        {commit.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-4 h-4" />
                        <span>{commit.author}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{commit.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commit Hash & Stats */}
                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <button
                        onClick={() => copyToClipboard(commit.fullHash)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors group"
                        title="Copy full hash"
                      >
                        <Hash className="w-4 h-4 text-slate-600" />
                        <span className="font-mono text-sm text-slate-700">{commit.hash}</span>
                        {copiedHash === commit.fullHash ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-end space-x-3 text-xs">
                      <span className="text-green-600 font-semibold">+{commit.additions}</span>
                      <span className="text-red-600 font-semibold">-{commit.deletions}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedCommit(expandedCommit === commit.hash ? null : commit.hash)}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <ChevronRight
                      className={`w-5 h-5 text-slate-600 transition-transform ${
                        expandedCommit === commit.hash ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCommit === commit.hash && (
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>{commit.filesChanged} files changed</span>
                </h4>
                <div className="space-y-2">
                  {commit.files.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-slate-200"
                    >
                      <span className="text-sm font-mono text-slate-700">{file.name}</span>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-green-600 font-semibold">+{file.additions}</span>
                        <span className="text-red-600 font-semibold">-{file.deletions}</span>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${(file.additions / (file.additions + file.deletions)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                  Full timestamp: {commit.timestamp}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitHistory;
