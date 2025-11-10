import React, { useState } from 'react';
import { GitPullRequest, MessageSquare, GitMerge, GitBranch, User, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const PullRequestsList = () => {
  const [filter, setFilter] = useState('open');

  // Mock pull requests data
  const pullRequests = [
    {
      id: 1,
      number: 42,
      title: 'Add GitHub repository viewer component',
      description: 'Implement a comprehensive GitHub repository viewer with file browser, commit history, and issues tracking',
      status: 'open',
      author: 'John Developer',
      authorAvatar: 'JD',
      createdAt: '2 hours ago',
      comments: 3,
      sourceBranch: 'feature/github-viewer',
      targetBranch: 'main',
      commits: 8,
      filesChanged: 12,
      additions: 856,
      deletions: 23,
      reviews: {
        approved: 1,
        changesRequested: 0,
        pending: 1
      },
      checks: {
        passed: 5,
        failed: 0,
        pending: 1
      }
    },
    {
      id: 2,
      number: 41,
      title: 'Fix responsive design issues',
      description: 'Resolves mobile layout problems and improves tablet experience',
      status: 'open',
      author: 'Sarah Williams',
      authorAvatar: 'SW',
      createdAt: '1 day ago',
      comments: 7,
      sourceBranch: 'fix/responsive-layout',
      targetBranch: 'main',
      commits: 5,
      filesChanged: 8,
      additions: 234,
      deletions: 156,
      reviews: {
        approved: 2,
        changesRequested: 0,
        pending: 0
      },
      checks: {
        passed: 6,
        failed: 0,
        pending: 0
      }
    },
    {
      id: 3,
      number: 40,
      title: 'Performance optimization for data tables',
      description: 'Implement virtualization and memoization for better performance',
      status: 'open',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      createdAt: '3 days ago',
      comments: 12,
      sourceBranch: 'perf/optimize-tables',
      targetBranch: 'develop',
      commits: 12,
      filesChanged: 6,
      additions: 445,
      deletions: 289,
      reviews: {
        approved: 1,
        changesRequested: 1,
        pending: 0
      },
      checks: {
        passed: 4,
        failed: 1,
        pending: 0
      }
    },
    {
      id: 4,
      number: 39,
      title: 'Update dependencies to latest versions',
      description: 'Bump all packages to their latest stable versions',
      status: 'merged',
      author: 'Jane Smith',
      authorAvatar: 'JS',
      createdAt: '5 days ago',
      mergedAt: '2 days ago',
      comments: 4,
      sourceBranch: 'chore/update-deps',
      targetBranch: 'main',
      commits: 2,
      filesChanged: 2,
      additions: 45,
      deletions: 38,
      reviews: {
        approved: 2,
        changesRequested: 0,
        pending: 0
      },
      checks: {
        passed: 6,
        failed: 0,
        pending: 0
      }
    },
    {
      id: 5,
      number: 38,
      title: 'Add dark mode theme',
      description: 'Implement dark mode with theme switching functionality',
      status: 'closed',
      author: 'Alex Turner',
      authorAvatar: 'AT',
      createdAt: '1 week ago',
      closedAt: '5 days ago',
      comments: 8,
      sourceBranch: 'feature/dark-mode',
      targetBranch: 'main',
      commits: 15,
      filesChanged: 24,
      additions: 1245,
      deletions: 156,
      reviews: {
        approved: 0,
        changesRequested: 1,
        pending: 0
      },
      checks: {
        passed: 3,
        failed: 2,
        pending: 0
      }
    }
  ];

  const filteredPRs = pullRequests.filter(pr => {
    if (filter === 'merged') return pr.status === 'merged';
    if (filter === 'closed') return pr.status === 'closed';
    return pr.status === 'open';
  });

  const openCount = pullRequests.filter(pr => pr.status === 'open').length;
  const mergedCount = pullRequests.filter(pr => pr.status === 'merged').length;
  const closedCount = pullRequests.filter(pr => pr.status === 'closed').length;

  const getStatusBadge = (status) => {
    if (status === 'open') return { color: 'text-green-600', icon: GitPullRequest };
    if (status === 'merged') return { color: 'text-purple-600', icon: GitMerge };
    return { color: 'text-red-600', icon: XCircle };
  };

  const getCheckStatus = (checks) => {
    if (checks.failed > 0) return { color: 'bg-red-100 text-red-700', text: 'Checks failed' };
    if (checks.pending > 0) return { color: 'bg-yellow-100 text-yellow-700', text: 'Checks pending' };
    return { color: 'bg-green-100 text-green-700', text: 'All checks passed' };
  };

  const getReviewStatus = (reviews) => {
    if (reviews.changesRequested > 0) return { color: 'bg-red-100 text-red-700', text: 'Changes requested' };
    if (reviews.pending > 0) return { color: 'bg-yellow-100 text-yellow-700', text: 'Review pending' };
    if (reviews.approved >= 2) return { color: 'bg-green-100 text-green-700', text: 'Approved' };
    return { color: 'bg-slate-100 text-slate-700', text: 'Awaiting review' };
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-indigo-600" />
            <span>Pull Requests</span>
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            New Pull Request
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
              <GitPullRequest className="w-4 h-4" />
              <span>Open</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {openCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => setFilter('merged')}
            className={`pb-3 px-2 border-b-2 font-medium transition-colors ${
              filter === 'merged'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-2">
              <GitMerge className="w-4 h-4" />
              <span>Merged</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {mergedCount}
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
              <XCircle className="w-4 h-4" />
              <span>Closed</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {closedCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Pull Requests List */}
      <div className="space-y-3">
        {filteredPRs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-12 text-center">
            <GitPullRequest className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No {filter} pull requests found</p>
          </div>
        ) : (
          filteredPRs.map((pr) => {
            const statusBadge = getStatusBadge(pr.status);
            const checkStatus = getCheckStatus(pr.checks);
            const reviewStatus = getReviewStatus(pr.reviews);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={pr.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Status Icon */}
                      <div className="mt-1">
                        <StatusIcon className={`w-5 h-5 ${statusBadge.color}`} />
                      </div>

                      {/* PR Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer mb-1">
                          {pr.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-3">
                          {pr.description}
                        </p>

                        {/* Branch Info */}
                        <div className="flex items-center space-x-2 text-xs text-slate-600 mb-3 font-mono">
                          <GitBranch className="w-3.5 h-3.5" />
                          <span className="font-semibold">{pr.sourceBranch}</span>
                          <span>→</span>
                          <span className="font-semibold">{pr.targetBranch}</span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${checkStatus.color}`}>
                            {checkStatus.text} ({pr.checks.passed}/{pr.checks.passed + pr.checks.failed + pr.checks.pending})
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${reviewStatus.color}`}>
                            {reviewStatus.text} ({pr.reviews.approved} approved)
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                          <span className="font-semibold">
                            {pr.commits} {pr.commits === 1 ? 'commit' : 'commits'}
                          </span>
                          <span className="font-semibold">
                            {pr.filesChanged} {pr.filesChanged === 1 ? 'file' : 'files'} changed
                          </span>
                          <span className="text-green-600 font-semibold">+{pr.additions}</span>
                          <span className="text-red-600 font-semibold">-{pr.deletions}</span>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="font-medium">#{pr.number}</span>
                          <span className="flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{pr.author}</span>
                          </span>
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>opened {pr.createdAt}</span>
                          </span>
                          {pr.mergedAt && (
                            <span className="flex items-center space-x-1.5 text-purple-600">
                              <GitMerge className="w-3.5 h-3.5" />
                              <span>merged {pr.mergedAt}</span>
                            </span>
                          )}
                          {pr.closedAt && !pr.mergedAt && (
                            <span className="flex items-center space-x-1.5 text-red-600">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>closed {pr.closedAt}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{pr.comments} comments</span>
                          </span>
                        </div>
                      </div>

                      {/* Author Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {pr.authorAvatar}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PullRequestsList;
