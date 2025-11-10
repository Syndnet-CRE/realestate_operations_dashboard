import React from 'react';
import { Calendar, Scale, HardDrive, GitBranch, Tag } from 'lucide-react';

const RepositoryOverview = ({ repository }) => {
  const infoItems = [
    {
      icon: GitBranch,
      label: 'Default Branch',
      value: repository?.defaultBranch,
      color: 'text-blue-600'
    },
    {
      icon: Tag,
      label: 'Language',
      value: repository?.language,
      color: 'text-yellow-600'
    },
    {
      icon: Scale,
      label: 'License',
      value: repository?.license,
      color: 'text-green-600'
    },
    {
      icon: HardDrive,
      label: 'Size',
      value: repository?.size,
      color: 'text-purple-600'
    },
    {
      icon: Calendar,
      label: 'Created',
      value: new Date(repository?.createdAt).toLocaleDateString(),
      color: 'text-slate-600'
    },
    {
      icon: Calendar,
      label: 'Updated',
      value: new Date(repository?.updatedAt).toLocaleDateString(),
      color: 'text-slate-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <h2 className="text-lg font-bold text-white">About</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {infoItems.map(({ icon: Icon, label, value, color }, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`${color} mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contributors Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Contributors</h3>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                title={`Contributor ${i}`}
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 font-semibold text-xs">
              +12
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Commits this month</span>
              <span className="text-sm font-bold text-slate-900">127</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryOverview;
