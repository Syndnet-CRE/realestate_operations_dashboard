import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, GitFork, Eye, Code, GitCommit, AlertCircle, GitPullRequest, BookOpen, Search } from 'lucide-react';
import githubService from 'services/githubService';
import RepositoryOverview from './components/RepositoryOverview';
import FileBrowser from './components/FileBrowser';
import CommitHistory from './components/CommitHistory';
import IssuesList from './components/IssuesList';
import PullRequestsList from './components/PullRequestsList';
import ReadmeViewer from './components/ReadmeViewer';
import AuthButton from './components/AuthButton';

const GitHubRepository = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('code');
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Get owner/repo from URL params or default
  const owner = searchParams.get('owner') || 'Syndnet-CRE';
  const repo = searchParams.get('repo') || 'realestate_operations_dashboard';

  // Fetch repository data
  useEffect(() => {
    const fetchRepository = async () => {
      if (!owner || !repo) return;

      setLoading(true);
      setError(null);

      try {
        const data = await githubService.getRepository(owner, repo);

        setRepository({
          name: data.name,
          owner: data.owner.login,
          ownerAvatar: data.owner.avatar_url,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          watchers: data.watchers_count,
          language: data.language,
          topics: data.topics || [],
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          defaultBranch: data.default_branch,
          license: data.license?.name || 'No license',
          size: `${(data.size / 1024).toFixed(1)} MB`,
          openIssues: data.open_issues_count,
          homepage: data.homepage,
          htmlUrl: data.html_url,
          private: data.private,
        });
      } catch (err) {
        console.error('Error fetching repository:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load repository');
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [owner, repo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    // Parse owner/repo from input (support formats: "owner/repo" or full URL)
    let newOwner, newRepo;

    if (searchInput.includes('github.com')) {
      // Extract from URL: https://github.com/owner/repo
      const match = searchInput.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (match) {
        newOwner = match[1];
        newRepo = match[2];
      }
    } else if (searchInput.includes('/')) {
      // Format: owner/repo
      const parts = searchInput.split('/');
      newOwner = parts[0];
      newRepo = parts[1];
    }

    if (newOwner && newRepo) {
      setSearchParams({ owner: newOwner, repo: newRepo });
      setSearchInput('');
    }
  };

  const tabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'issues', label: 'Issues', icon: AlertCircle, badge: repository?.openIssues },
    { id: 'pulls', label: 'Pull Requests', icon: GitPullRequest },
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Repository</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!repository) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Bar with Search and Auth */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search repository: owner/repo or paste GitHub URL"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20"
                />
              </div>
            </form>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <img
                  src={repository.ownerAvatar}
                  alt={repository.owner}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    <span className="text-slate-500">{repository.owner} /</span> {repository.name}
                  </h1>
                  {repository.description && (
                    <p className="text-slate-600 mt-1">{repository.description}</p>
                  )}
                </div>
              </div>

              {/* Topics */}
              {repository.topics && repository.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {repository.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 ml-8">
              <a
                href={`${repository.htmlUrl}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="font-semibold">{repository.stars}</span>
                <span className="text-sm">Stars</span>
              </a>
              <a
                href={`${repository.htmlUrl}/forks`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <GitFork className="w-5 h-5" />
                <span className="font-semibold">{repository.forks}</span>
                <span className="text-sm">Forks</span>
              </a>
              <div className="flex items-center space-x-2 text-slate-600">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">{repository.watchers}</span>
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
            <RepositoryOverview repository={repository} owner={owner} repo={repo} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'code' && <FileBrowser owner={owner} repo={repo} defaultBranch={repository.defaultBranch} />}
            {activeTab === 'issues' && <IssuesList owner={owner} repo={repo} />}
            {activeTab === 'pulls' && <PullRequestsList owner={owner} repo={repo} />}
            {activeTab === 'commits' && <CommitHistory owner={owner} repo={repo} />}
            {activeTab === 'readme' && <ReadmeViewer owner={owner} repo={repo} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubRepository;
