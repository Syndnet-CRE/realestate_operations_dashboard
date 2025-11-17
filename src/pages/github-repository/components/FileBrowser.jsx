import React, { useState, useEffect } from 'react';
import { File, Folder, ChevronRight, Code2, FileJson, FileText, Image, Download, Eye, AlertCircle } from 'lucide-react';
import githubService from 'services/githubService';

const FileBrowser = ({ owner, repo, defaultBranch }) => {
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    fetchContents(currentPath);
  }, [owner, repo, currentPath]);

  const fetchContents = async (path) => {
    setLoading(true);
    setError(null);
    try {
      const data = await githubService.getContents(owner, repo, path);
      setFiles(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Error fetching contents:', err);
      setError(err.response?.data?.error || 'Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (file) => {
    if (file.type !== 'file') return;
    try {
      if (file.download_url) {
        const response = await fetch(file.download_url);
        const content = await response.text();
        setFileContent(content);
      }
    } catch (err) {
      setFileContent('Error loading file content');
    }
  };

  const getFileIcon = (name, type) => {
    if (type === 'dir') return Folder;
    if (name.endsWith('.json')) return FileJson;
    if (name.endsWith('.md')) return FileText;
    if (name.match(/\.(png|jpg|jpeg|gif|ico|svg)$/i)) return Image;
    if (name.match(/\.(jsx?|tsx?|py|java)$/i)) return Code2;
    return File;
  };

  const getFileColor = (name, type) => {
    if (type === 'dir') return 'text-blue-600';
    if (name.endsWith('.json')) return 'text-yellow-600';
    if (name.endsWith('.md')) return 'text-slate-600';
    if (name.match(/\.(jsx?|tsx?)$/)) return 'text-purple-600';
    return 'text-slate-500';
  };

  const handleFileClick = (file) => {
    if (file.type === 'dir') {
      setCurrentPath(file.path);
      setSelectedFile(null);
      setFileContent(null);
    } else {
      setSelectedFile(file);
      fetchFileContent(file);
    }
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
    setSelectedFile(null);
    setFileContent(null);
  };

  const pathSegments = currentPath ? currentPath.split('/') : [];

  if (loading && files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-center text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3">
        <div className="flex items-center space-x-2 text-sm">
          <button onClick={() => { setCurrentPath(''); setSelectedFile(null); }} className="text-indigo-600 hover:text-indigo-800 font-semibold">{repo}</button>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button onClick={() => { const newPath = pathSegments.slice(0, index + 1).join('/'); setCurrentPath(newPath); setSelectedFile(null); }} className="text-indigo-600 hover:text-indigo-800 font-semibold">{segment}</button>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3"><h3 className="font-semibold text-slate-900">{files.length} {files.length === 1 ? 'item' : 'items'}</h3></div>
        <div className="divide-y divide-slate-100">
          {currentPath && (<button onClick={navigateUp} className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"><Folder className="w-5 h-5 text-blue-600" /><span className="font-medium text-blue-600">..</span></button>)}
          {files.map((item) => { const IconComponent = getFileIcon(item.name, item.type); const iconColor = getFileColor(item.name, item.type); return (<button key={item.path} onClick={() => handleFileClick(item)} className={`w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left group ${selectedFile?.path === item.path ? 'bg-indigo-50' : ''}`}><IconComponent className={`w-5 h-5 ${iconColor}`} /><div className="flex-1 min-w-0"><p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</p></div>{item.size && <span className="text-sm text-slate-500">{(item.size / 1024).toFixed(1)} KB</span>}</button>);})}
        </div>
      </div>
      {selectedFile && (<div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"><div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between"><h3 className="font-semibold text-slate-900 flex items-center space-x-2"><Code2 className="w-5 h-5 text-indigo-600" /><span>{selectedFile.name}</span></h3><div className="flex items-center space-x-2"><a href={selectedFile.html_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-200 rounded-md transition-colors" title="View on GitHub"><Eye className="w-4 h-4 text-slate-600" /></a><a href={selectedFile.download_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-200 rounded-md transition-colors" title="Download"><Download className="w-4 h-4 text-slate-600" /></a></div></div><div className="p-6 bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto max-h-96">{fileContent ? <pre className="text-green-400 whitespace-pre-wrap break-words">{fileContent}</pre> : <p className="text-slate-400">Loading file content...</p>}</div></div>)}
    </div>
  );
};

export default FileBrowser;
