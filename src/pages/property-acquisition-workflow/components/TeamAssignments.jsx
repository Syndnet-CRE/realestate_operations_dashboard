import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TeamAssignments = ({ assignments, onAssignmentUpdate, onEscalate }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", role: "Acquisition Manager", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", status: "available" },
    { id: 2, name: "Michael Chen", role: "Due Diligence Specialist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", status: "busy" },
    { id: 3, name: "Emily Rodriguez", role: "Financial Analyst", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", status: "available" },
    { id: 4, name: "David Kim", role: "Legal Counsel", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", status: "available" },
    { id: 5, name: "Lisa Thompson", role: "Property Inspector", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", status: "busy" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in-progress': return 'text-primary bg-primary/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-background';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-error';
      case 'medium': return 'border-l-4 border-warning';
      case 'low': return 'border-l-4 border-success';
      default: return '';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAssignTask = (taskId) => {
    setSelectedTask(taskId);
    setShowAssignModal(true);
  };

  const handleStatusUpdate = (assignmentId, newStatus) => {
    if (onAssignmentUpdate) {
      onAssignmentUpdate(assignmentId, { status: newStatus });
    }
  };

  const handleEscalate = (assignmentId) => {
    if (onEscalate) {
      onEscalate(assignmentId);
    }
  };

  const overdueTasks = assignments.filter(a => a.status === 'overdue').length;
  const activeTasks = assignments.filter(a => a.status === 'in-progress').length;

  return (
    <div className="bg-surface border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading-medium text-text-primary">Team Assignments</h3>
          <Button
            variant="primary"
            iconName="UserPlus"
            onClick={() => setShowAssignModal(true)}
            className="text-xs px-3 py-1"
          >
            Assign
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <div>
                <p className="text-xs text-text-secondary">Active Tasks</p>
                <p className="font-data text-text-primary">{activeTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <div>
                <p className="text-xs text-text-secondary">Overdue</p>
                <p className="font-data text-error">{overdueTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assignments List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {assignments.map(assignment => (
            <div
              key={assignment.id}
              className={`bg-surface border rounded-lg p-3 transition-smooth hover:shadow-base ${getPriorityColor(assignment.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-body-medium text-text-primary text-sm line-clamp-2">
                  {assignment.task}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                  {assignment.status.replace('-', ' ')}
                </span>
              </div>
              
              {/* Assignee */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {assignment.assignee?.avatar ? (
                    <img 
                      src={assignment.assignee.avatar} 
                      alt={assignment.assignee.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(assignment.assignee?.name || 'UN')
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-body-medium text-text-primary">
                    {assignment.assignee?.name || 'Unassigned'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {assignment.assignee?.role || 'No role assigned'}
                  </p>
                </div>
              </div>
              
              {/* Due Date and Progress */}
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} className="text-text-secondary" />
                  <span className={`${
                    assignment.status === 'overdue' ? 'text-error' : 'text-text-secondary'
                  }`}>
                    Due: {assignment.dueDate}
                  </span>
                </div>
                {assignment.progress && (
                  <span className="text-text-secondary">
                    {assignment.progress}% complete
                  </span>
                )}
              </div>
              
              {/* Progress Bar */}
              {assignment.progress && (
                <div className="w-full bg-background rounded-full h-1.5 mb-3">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {assignment.status === 'pending' && (
                    <Button
                      variant="primary"
                      onClick={() => handleStatusUpdate(assignment.id, 'in-progress')}
                      className="text-xs px-2 py-1"
                    >
                      Start
                    </Button>
                  )}
                  {assignment.status === 'in-progress' && (
                    <Button
                      variant="success"
                      onClick={() => handleStatusUpdate(assignment.id, 'completed')}
                      className="text-xs px-2 py-1"
                    >
                      Complete
                    </Button>
                  )}
                  {!assignment.assignee && (
                    <Button
                      variant="outline"
                      onClick={() => handleAssignTask(assignment.id)}
                      className="text-xs px-2 py-1"
                    >
                      Assign
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {assignment.priority === 'high' && (
                    <Icon name="AlertTriangle" size={12} className="text-error" />
                  )}
                  {assignment.status === 'overdue' && (
                    <Button
                      variant="ghost"
                      onClick={() => handleEscalate(assignment.id)}
                      className="text-xs px-2 py-1 text-error"
                    >
                      Escalate
                    </Button>
                  )}
                  <button className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                    <Icon name="MoreVertical" size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {assignments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="Users" size={24} className="text-text-secondary mb-2" />
            <p className="text-text-secondary text-sm">No assignments yet</p>
            <p className="text-text-secondary text-xs">Create tasks and assign team members</p>
          </div>
        )}
      </div>
      
      {/* Team Members Quick View */}
      <div className="p-4 border-t border-border">
        <h4 className="font-body-medium text-text-primary text-sm mb-3">Team Status</h4>
        <div className="space-y-2">
          {teamMembers.slice(0, 3).map(member => (
            <div key={member.id} className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(member.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body-medium text-text-primary truncate">
                  {member.name}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                member.status === 'available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamAssignments;