import React, { useState, useEffect } from 'react';
import { Star, GitFork, Eye, Code, GitCommit, AlertCircle, GitPullRequest, BookOpen } from 'lucide-react';
import RepositoryOverview from './components/RepositoryOverview';
import FileBrowser from './components/FileBrowser';
import CommitHistory from './components/CommitHistory';
import IssuesList from './components/IssuesList';
import PullRequestsList from './components/PullRequestsList';
import ReadmeViewer from './components/ReadmeViewer';

const GitHubRepository = () => {
  const [activeTab, setActiveTab] = useState('code');
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock repository data - In production, this would come from GitHub API
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setRepository({
        name: 'realestate_operations_dashboard',
        owner: 'Syndnet-CRE',
        description: 'A modern React-based project for real estate operations management with comprehensive deal tracking and analytics',
        stars: 156,
        forks: 42,
        watchers: 23,
        language: 'JavaScript',
        topics: ['react', 'real-estate', 'dashboard', 'tailwindcss', 'vite'],
        createdAt: '2024-01-15',
        updatedAt: '2025-11-10',
        defaultBranch: 'main',
        license: 'MIT',
        size: '2.4 MB',
        openIssues: 8,
        openPRs: 3
      });
      setLoading(false);
    }, 800);
  }, []);

  const tabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'issues', label: 'Issues', icon: AlertCircle, badge: repository?.openIssues },
    { id: 'pulls', label: 'Pull Requests', icon: GitPullRequest, badge: repository?.openPRs },
    { id: 'commits', label: 'Commits', icon: GitCommit },
    { id: 'readme', label: 'README', icon: BookOpen }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    <span className="text-slate-500">{repository?.owner} /</span> {repository?.name}
                  </h1>
                  <p className="text-slate-600 mt-1">{repository?.description}</p>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mt-4">
                {repository?.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">
                <Star className="w-5 h-5" />
                <span className="font-semibold">{repository?.stars}</span>
                <span className="text-sm">Stars</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">
                <GitFork className="w-5 h-5" />
                <span className="font-semibold">{repository?.forks}</span>
                <span className="text-sm">Forks</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">{repository?.watchers}</span>
                <span className="text-sm">Watching</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-all
                  ${activeTab === id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Repository Overview */}
          <div className="lg:col-span-1">
            <RepositoryOverview repository={repository} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'code' && <FileBrowser />}
            {activeTab === 'issues' && <IssuesList />}
            {activeTab === 'pulls' && <PullRequestsList />}
            {activeTab === 'commits' && <CommitHistory />}
            {activeTab === 'readme' && <ReadmeViewer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubRepository;
