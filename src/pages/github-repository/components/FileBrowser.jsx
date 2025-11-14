import React, { useState } from 'react';
import { File, Folder, ChevronRight, Code2, FileJson, FileText, Image, Download, Eye } from 'lucide-react';

const FileBrowser = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock file structure
  const fileStructure = {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'App.jsx', type: 'file', size: '2.4 KB', language: 'jsx', modified: '2 hours ago' },
          { name: 'Routes.jsx', type: 'file', size: '1.8 KB', language: 'jsx', modified: '1 day ago' },
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'Header.jsx', type: 'file', size: '3.2 KB', language: 'jsx', modified: '3 days ago' },
              { name: 'Footer.jsx', type: 'file', size: '1.5 KB', language: 'jsx', modified: '1 week ago' }
            ]
          },
          {
            name: 'pages',
            type: 'folder',
            children: [
              { name: 'github-repository', type: 'folder', children: [] }
            ]
          }
        ]
      },
      {
        name: 'public',
        type: 'folder',
        children: [
          { name: 'favicon.ico', type: 'file', size: '4.2 KB', language: 'image', modified: '2 weeks ago' },
          { name: 'index.html', type: 'file', size: '822 B', language: 'html', modified: '1 week ago' }
        ]
      },
      { name: 'package.json', type: 'file', size: '1.6 KB', language: 'json', modified: '5 days ago' },
      { name: 'README.md', type: 'file', size: '2.9 KB', language: 'markdown', modified: '1 day ago' },
      { name: 'tailwind.config.js', type: 'file', size: '2.6 KB', language: 'javascript', modified: '3 days ago' },
      { name: '.gitignore', type: 'file', size: '87 B', language: 'text', modified: '2 weeks ago' }
    ]
  };

  const getFileIcon = (name, type) => {
    if (type === 'folder') return Folder;
    if (name.endsWith('.json')) return FileJson;
    if (name.endsWith('.md')) return FileText;
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.ico')) return Image;
    if (name.endsWith('.jsx') || name.endsWith('.js')) return Code2;
    return File;
  };

  const getFileColor = (name, type) => {
    if (type === 'folder') return 'text-blue-600';
    if (name.endsWith('.json')) return 'text-yellow-600';
    if (name.endsWith('.md')) return 'text-slate-600';
    if (name.endsWith('.jsx') || name.endsWith('.js')) return 'text-purple-600';
    return 'text-slate-500';
  };

  const getCurrentDirectory = () => {
    let current = fileStructure;
    for (const path of currentPath) {
      current = current.children.find(item => item.name === path);
    }
    return current.children || [];
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedFile(null);
  };

  const navigateUp = () => {
    setCurrentPath(currentPath.slice(0, -1));
    setSelectedFile(null);
  };

  const handleFileClick = (file) => {
    if (file.type === 'folder') {
      navigateToFolder(file.name);
    } else {
      setSelectedFile(file);
    }
  };

  const currentFiles = getCurrentDirectory();

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3">
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => setCurrentPath([])}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            root
          </button>
          {currentPath.map((path, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {path}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              {currentFiles.length} {currentFiles.length === 1 ? 'item' : 'items'}
            </h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                Latest commit
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {currentPath.length > 0 && (
            <button
              onClick={navigateUp}
              className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
            >
              <Folder className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-600">..</span>
            </button>
          )}

          {currentFiles.map((item, index) => {
            const IconComponent = getFileIcon(item.name, item.type);
            const iconColor = getFileColor(item.name, item.type);

            return (
              <button
                key={index}
                onClick={() => handleFileClick(item)}
                className={`w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left group ${
                  selectedFile?.name === item.name ? 'bg-indigo-50' : ''
                }`}
              >
                <IconComponent className={`w-5 h-5 ${iconColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </p>
                </div>
                {item.type === 'file' && (
                  <>
                    <span className="text-sm text-slate-500">{item.size}</span>
                    <span className="text-sm text-slate-400">{item.modified}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <span>{selectedFile.name}</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-200 rounded-md transition-colors" title="View raw">
                <Eye className="w-4 h-4 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-200 rounded-md transition-colors" title="Download">
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="p-6 bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">
{`// ${selectedFile.name}
// File size: ${selectedFile.size}
// Last modified: ${selectedFile.modified}

// File preview would appear here
// This is a placeholder for the actual file content

import React from 'react';

const Component = () => {
  return (
    <div className="example">
      <h1>Example Code</h1>
    </div>
  );
};

export default Component;`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileBrowser;
