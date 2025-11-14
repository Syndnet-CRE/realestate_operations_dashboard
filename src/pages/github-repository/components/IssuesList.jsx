import React, { useState } from 'react';
import { AlertCircle, MessageSquare, Tag, Calendar, User, CheckCircle2, XCircle } from 'lucide-react';

const IssuesList = () => {
  const [filter, setFilter] = useState('open');

  // Mock issues data
  const issues = [
    {
      id: 1,
      title: 'Add support for dark mode in all components',
      description: 'Need to implement dark mode theme across all UI components for better user experience',
      status: 'open',
      author: 'Sarah Williams',
      authorAvatar: 'SW',
      createdAt: '3 hours ago',
      comments: 5,
      labels: ['enhancement', 'ui'],
      priority: 'high'
    },
    {
      id: 2,
      title: 'Fix responsive layout on mobile devices',
      description: 'The layout breaks on screens smaller than 768px',
      status: 'open',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      createdAt: '1 day ago',
      comments: 12,
      labels: ['bug', 'responsive'],
      priority: 'critical'
    },
    {
      id: 3,
      title: 'Improve performance of data table rendering',
      description: 'Large datasets cause significant lag in the table component',
      status: 'open',
      author: 'John Developer',
      authorAvatar: 'JD',
      createdAt: '2 days ago',
      comments: 8,
      labels: ['performance', 'optimization'],
      priority: 'high'
    },
    {
      id: 4,
      title: 'Add search functionality to file browser',
      description: 'Users should be able to search for files by name',
      status: 'open',
      author: 'Jane Smith',
      authorAvatar: 'JS',
      createdAt: '3 days ago',
      comments: 3,
      labels: ['enhancement', 'feature'],
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Update documentation for new API endpoints',
      description: 'API documentation is outdated and needs to be refreshed',
      status: 'closed',
      author: 'Alex Turner',
      authorAvatar: 'AT',
      createdAt: '1 week ago',
      closedAt: '2 days ago',
      comments: 7,
      labels: ['documentation'],
      priority: 'low'
    },
    {
      id: 6,
      title: 'Fix memory leak in commit history component',
      description: 'Memory usage increases over time when viewing commit history',
      status: 'closed',
      author: 'Chris Anderson',
      authorAvatar: 'CA',
      createdAt: '2 weeks ago',
      closedAt: '1 week ago',
      comments: 15,
      labels: ['bug', 'performance'],
      priority: 'critical'
    }
  ];

  const filteredIssues = issues.filter(issue => issue.status === filter);

  const getLabelColor = (label) => {
    const colors = {
      bug: 'bg-red-100 text-red-700 border-red-200',
      enhancement: 'bg-blue-100 text-blue-700 border-blue-200',
      feature: 'bg-purple-100 text-purple-700 border-purple-200',
      documentation: 'bg-slate-100 text-slate-700 border-slate-200',
      performance: 'bg-orange-100 text-orange-700 border-orange-200',
      ui: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      responsive: 'bg-pink-100 text-pink-700 border-pink-200',
      optimization: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[label] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-slate-400 text-white'
    };
    return badges[priority] || badges.low;
  };

  const openCount = issues.filter(i => i.status === 'open').length;
  const closedCount = issues.filter(i => i.status === 'closed').length;

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <span>Issues</span>
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            New Issue
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-4 border-b border-slate-200">
          <button
            onClick={() => setFilter('open')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              filter === 'open'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Open</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {openCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              filter === 'closed'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Closed</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {closedCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No {filter} issues found</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {issue.status === 'open' ? (
                        <AlertCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>

                    {/* Issue Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer">
                          {issue.title}
                        </h3>
                        <span className={`ml-4 px-2.5 py-1 text-xs font-bold rounded-full ${getPriorityBadge(issue.priority)}`}>
                          {issue.priority.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-3">
                        {issue.description}
                      </p>

                      {/* Labels */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {issue.labels.map((label, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getLabelColor(label)}`}
                          >
                            <Tag className="w-3 h-3" />
                            <span>{label}</span>
                          </span>
                        ))}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">#{issue.id}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{issue.author}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>opened {issue.createdAt}</span>
                        </span>
                        {issue.closedAt && (
                          <span className="flex items-center space-x-1.5 text-purple-600">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>closed {issue.closedAt}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{issue.comments} comments</span>
                        </span>
                      </div>
                    </div>

                    {/* Author Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {issue.authorAvatar}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesList;
