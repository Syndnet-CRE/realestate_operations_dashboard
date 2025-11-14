import React from 'react';
import { BookOpen, Code, Terminal, CheckCircle, ExternalLink } from 'lucide-react';

const ReadmeViewer = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>README.md</span>
        </h2>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors">
            Edit
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors">
            Raw
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 prose prose-slate max-w-none">
        <div className="space-y-6">
          {/* Title Section */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Real Estate Operations Dashboard
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              A modern React-based project utilizing the latest frontend technologies and tools for building
              responsive web applications focused on real estate operations management.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>🚀</span>
              <span>Features</span>
            </h2>
            <ul className="space-y-3">
              {[
                { title: 'React 18', desc: 'Latest React version with improved rendering and concurrent features' },
                { title: 'Vite', desc: 'Lightning-fast build tool and development server' },
                { title: 'Redux Toolkit', desc: 'State management with simplified Redux setup' },
                { title: 'TailwindCSS', desc: 'Utility-first CSS framework with extensive customization' },
                { title: 'React Router v6', desc: 'Declarative routing for React applications' },
                { title: 'Data Visualization', desc: 'Integrated D3.js and Recharts for powerful data visualization' },
                { title: 'Form Management', desc: 'React Hook Form for efficient form handling' },
                { title: 'Animation', desc: 'Framer Motion for smooth UI animations' }
              ].map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">{feature.title}</strong>
                    <span className="text-slate-600"> - {feature.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>📋</span>
              <span>Prerequisites</span>
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Node.js (v14.x or higher)</li>
              <li>npm or yarn</li>
            </ul>
          </div>

          {/* Installation */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>🛠️</span>
              <span>Installation</span>
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-slate-700 mb-2">1. Install dependencies:</p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span>npm install</span>
                    </div>
                    <div className="text-slate-500"># or</div>
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4" />
                      <span>yarn install</span>
                    </div>
                  </code>
                </div>
              </div>

              <div>
                <p className="text-slate-700 mb-2">2. Start the development server:</p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span>npm start</span>
                    </div>
                    <div className="text-slate-500"># or</div>
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4" />
                      <span>yarn start</span>
                    </div>
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Project Structure */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>📁</span>
              <span>Project Structure</span>
            </h2>
            <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 font-mono text-sm">
{`realestate_operations_dashboard/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── github-repository/
│   │   ├── deal-pipeline-dashboard/
│   │   └── ...
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration`}
              </pre>
            </div>
          </div>

          {/* Deployment */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>📦</span>
              <span>Deployment</span>
            </h2>
            <p className="text-slate-700 mb-2">Build the application for production:</p>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>npm run build</span>
                </div>
              </code>
            </div>
          </div>

          {/* GitHub Features */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Code className="w-6 h-6 text-indigo-600" />
              <span>GitHub Repository Features</span>
            </h2>
            <p className="text-slate-700 mb-4">
              This repository now includes a comprehensive GitHub repository viewer with the following capabilities:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Interactive file browser with directory navigation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Detailed commit history with file change tracking</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Issues management with filtering and labels</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Pull requests viewer with review status</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Repository statistics and contributor information</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <span>🙏</span>
              <span>Acknowledgments</span>
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>Built with <a href="#" className="text-indigo-600 hover:text-indigo-800 font-semibold">Rocket.new</a></span>
              </li>
              <li className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>Powered by React and Vite</span>
              </li>
              <li className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>Styled with Tailwind CSS</span>
              </li>
            </ul>
            <p className="mt-4 text-slate-600 italic">Built with ❤️ on Rocket.new</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeViewer;
