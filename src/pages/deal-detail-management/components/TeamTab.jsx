import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TeamTab = ({ dealId, onTeamUpdate }) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Deal Manager',
      email: 'john.doe@realestate.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'active',
      permissions: ['view_all', 'edit_all', 'approve'],
      joinedDate: '2024-01-01',
      tasksAssigned: 8,
      tasksCompleted: 6
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Financial Analyst',
      email: 'sarah.johnson@realestate.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'active',
      permissions: ['view_financial', 'edit_financial'],
      joinedDate: '2024-01-02',
      tasksAssigned: 5,
      tasksCompleted: 4
    },
    {
      id: 3,
      name: 'Mike Wilson',
      role: 'Property Inspector',
      email: 'mike.wilson@realestate.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      status: 'active',
      permissions: ['view_property', 'edit_inspection'],
      joinedDate: '2024-01-05',
      tasksAssigned: 3,
      tasksCompleted: 2
    },
    {
      id: 4,
      name: 'Lisa Chen',
      role: 'Legal Advisor',
      email: 'lisa.chen@realestate.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      status: 'busy',
      permissions: ['view_legal', 'edit_legal'],
      joinedDate: '2024-01-08',
      tasksAssigned: 4,
      tasksCompleted: 3
    },
    {
      id: 5,
      name: 'David Brown',
      role: 'Sales Agent',
      email: 'david.brown@realestate.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      status: 'away',
      permissions: ['view_sales', 'edit_sales'],
      joinedDate: '2024-01-10',
      tasksAssigned: 2,
      tasksCompleted: 1
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Complete Financial Analysis',
      description: 'Finalize ROI calculations and cash flow projections',
      assignee: 'Sarah Johnson',
      assigneeId: 2,
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15',
      completedDate: null
    },
    {
      id: 2,
      title: 'Property Inspection Report',
      description: 'Submit detailed property inspection findings',
      assignee: 'Mike Wilson',
      assigneeId: 3,
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-18',
      createdDate: '2024-01-12',
      completedDate: '2024-01-17'
    },
    {
      id: 3,
      title: 'Legal Document Review',
      description: 'Review and approve purchase agreement terms',
      assignee: 'Lisa Chen',
      assigneeId: 4,
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-22',
      createdDate: '2024-01-16',
      completedDate: null
    },
    {
      id: 4,
      title: 'Market Comparison Analysis',
      description: 'Prepare comparative market analysis for pricing strategy',
      assignee: 'David Brown',
      assigneeId: 5,
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-25',
      createdDate: '2024-01-18',
      completedDate: null
    }
  ];

  const activityFeed = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      action: 'completed task',
      target: 'Financial Analysis Review',
      timestamp: '2024-01-17T14:30:00Z'
    },
    {
      id: 2,
      user: 'Mike Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      action: 'uploaded document',
      target: 'Property Inspection Report.pdf',
      timestamp: '2024-01-17T11:15:00Z'
    },
    {
      id: 3,
      user: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      action: 'assigned task to',
      target: 'Lisa Chen',
      timestamp: '2024-01-16T16:45:00Z'
    },
    {
      id: 4,
      user: 'Lisa Chen',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      action: 'commented on',
      target: 'Purchase Agreement Review',
      timestamp: '2024-01-16T09:20:00Z'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'busy': return 'bg-warning/10 text-warning';
      case 'away': return 'bg-text-secondary/10 text-text-secondary';
      default: return 'bg-text-secondary/10 text-text-secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-text-secondary/10 text-text-secondary';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'in_progress': return 'bg-warning/10 text-warning';
      case 'pending': return 'bg-text-secondary/10 text-text-secondary';
      default: return 'bg-text-secondary/10 text-text-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  const handleAddTask = () => {
    const task = {
      ...newTask,
      id: Date.now(),
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0],
      completedDate: null
    };
    
    console.log('Adding new task:', task);
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });
    setShowTaskModal(false);
  };

  const handleMemberAction = (action, memberId) => {
    console.log(`Member action: ${action} for member:`, memberId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading-semibold text-text-primary text-lg">Team & Collaboration</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowAddMember(true)} iconName="UserPlus">
            Add Member
          </Button>
          <Button variant="primary" onClick={() => setShowTaskModal(true)} iconName="Plus">
            Assign Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="xl:col-span-2 space-y-6">
          {/* Members List */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <h4 className="font-body-medium text-text-primary">Team Members</h4>
            </div>
            <div className="divide-y divide-border">
              {teamMembers.map((member) => (
                <div key={member.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${
                          member.status === 'active' ? 'bg-success' :
                          member.status === 'busy' ? 'bg-warning' : 'bg-text-secondary'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-body-medium text-text-primary">{member.name}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">{member.role}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                          <span className="flex items-center space-x-1">
                            <Icon name="Mail" size={12} />
                            <span>{member.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Phone" size={12} />
                            <span>{member.phone}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <p className="text-text-primary font-body-medium">
                          {member.tasksCompleted}/{member.tasksAssigned}
                        </p>
                        <p className="text-text-secondary text-xs">Tasks</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMemberAction('message', member.id)}
                          className="p-2 text-text-secondary hover:text-text-primary rounded transition-smooth"
                          title="Send Message"
                        >
                          <Icon name="MessageCircle" size={16} />
                        </button>
                        <button
                          onClick={() => handleMemberAction('call', member.id)}
                          className="p-2 text-text-secondary hover:text-text-primary rounded transition-smooth"
                          title="Call"
                        >
                          <Icon name="Phone" size={16} />
                        </button>
                        <button
                          onClick={() => handleMemberAction('settings', member.id)}
                          className="p-2 text-text-secondary hover:text-text-primary rounded transition-smooth"
                          title="Settings"
                        >
                          <Icon name="Settings" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <h4 className="font-body-medium text-text-primary">Assigned Tasks</h4>
            </div>
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div key={task.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-body-medium text-text-primary">{task.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-text-secondary">
                        <span className="flex items-center space-x-1">
                          <Icon name="User" size={12} />
                          <span>{task.assignee}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Calendar" size={12} />
                          <span>Due {formatDate(task.dueDate)}</span>
                        </span>
                        {task.completedDate && (
                          <span className="flex items-center space-x-1 text-success">
                            <Icon name="CheckCircle" size={12} />
                            <span>Completed {formatDate(task.completedDate)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                        <Icon name="Edit" size={16} />
                      </button>
                      <button className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                        <Icon name="MessageCircle" size={16} />
                      </button>
                      {task.status !== 'completed' && (
                        <button className="p-1 text-text-secondary hover:text-success rounded transition-smooth">
                          <Icon name="CheckCircle" size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="xl:col-span-1">
          <div className="bg-surface border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <h4 className="font-body-medium text-text-primary">Recent Activity</h4>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={activity.avatar} 
                        alt={activity.user}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-body-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-body-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading-medium text-text-primary">Assign New Task</h4>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Task Title
                </label>
                <Input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm resize-none"
                  placeholder="Enter task description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Assignee
                  </label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
                  >
                    <option value="">Select assignee</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button variant="ghost" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddTask}>
                Assign Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;