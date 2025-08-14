import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TimelineTab = ({ dealId, onTimelineUpdate }) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'milestone',
    date: '',
    assignee: ''
  });

  const eventTypes = [
    { id: 'all', label: 'All Events', color: 'text-text-secondary' },
    { id: 'milestone', label: 'Milestones', color: 'text-primary' },
    { id: 'task', label: 'Tasks', color: 'text-accent' },
    { id: 'meeting', label: 'Meetings', color: 'text-success' },
    { id: 'document', label: 'Documents', color: 'text-warning' },
    { id: 'communication', label: 'Communications', color: 'text-text-secondary' }
  ];

  const timelineEvents = [
    {
      id: 1,
      type: 'milestone',
      title: 'Deal Initiated',
      description: 'Initial property evaluation and deal setup completed',
      date: '2024-01-01T09:00:00Z',
      user: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'completed',
      attachments: []
    },
    {
      id: 2,
      type: 'document',
      title: 'Purchase Agreement Uploaded',
      description: 'Initial purchase agreement draft uploaded for review',
      date: '2024-01-03T14:30:00Z',
      user: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'completed',
      attachments: [{ name: 'Purchase_Agreement_v1.pdf', size: '2.4 MB' }]
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Property Inspection Scheduled',
      description: 'Scheduled property inspection with certified inspector',
      date: '2024-01-05T10:00:00Z',
      user: 'Mike Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      status: 'completed',
      attachments: []
    },
    {
      id: 4,
      type: 'task',
      title: 'Financial Analysis Review',
      description: 'Complete comprehensive financial analysis and ROI calculations',
      date: '2024-01-08T16:00:00Z',
      user: 'Lisa Chen',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      status: 'in_progress',
      attachments: []
    },
    {
      id: 5,
      type: 'communication',
      title: 'Seller Negotiation',
      description: 'Initial price negotiation with seller representative',
      date: '2024-01-10T11:30:00Z',
      user: 'David Brown',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      status: 'pending',
      attachments: []
    },
    {
      id: 6,
      type: 'milestone',
      title: 'Due Diligence Period',
      description: 'Begin 30-day due diligence period for property evaluation',
      date: '2024-01-12T09:00:00Z',
      user: 'Emma Davis',
      avatar: 'https://randomuser.me/api/portraits/women/82.jpg',
      status: 'upcoming',
      attachments: []
    },
    {
      id: 7,
      type: 'task',
      title: 'Loan Application Submission',
      description: 'Submit loan application with all required documentation',
      date: '2024-01-15T14:00:00Z',
      user: 'Robert Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
      status: 'upcoming',
      attachments: []
    }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'milestone': return 'Flag';
      case 'task': return 'CheckSquare';
      case 'meeting': return 'Calendar';
      case 'document': return 'FileText';
      case 'communication': return 'MessageCircle';
      default: return 'Circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'milestone': return 'bg-primary text-primary-foreground';
      case 'task': return 'bg-accent text-accent-foreground';
      case 'meeting': return 'bg-success text-success-foreground';
      case 'document': return 'bg-warning text-warning-foreground';
      case 'communication': return 'bg-text-secondary text-surface';
      default: return 'bg-text-secondary text-surface';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in_progress': return 'text-warning';
      case 'pending': return 'text-accent';
      case 'upcoming': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return date < now ? 'Yesterday' : 'Tomorrow';
    if (diffDays < 7) return date < now ? `${diffDays} days ago` : `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = timelineEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      user: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'upcoming',
      attachments: []
    };
    
    console.log('Adding new event:', event);
    setNewEvent({ title: '', description: '', type: 'milestone', date: '', assignee: '' });
    setShowAddEvent(false);
    
    if (onTimelineUpdate) {
      onTimelineUpdate(event);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading-semibold text-text-primary text-lg">Timeline</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" iconName="Calendar">
            Calendar View
          </Button>
          <Button variant="primary" onClick={() => setShowAddEvent(true)} iconName="Plus">
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFilterType(type.id)}
            className={`px-3 py-1 rounded-full text-sm transition-smooth ${
              filterType === type.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline Events */}
        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                <Icon name={getEventIcon(event.type)} size={16} />
              </div>

              {/* Event Content */}
              <div className="flex-1 bg-surface border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-body-medium text-text-primary">{event.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        event.status === 'completed' ? 'bg-success/10 text-success' :
                        event.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                        event.status === 'pending'? 'bg-accent/10 text-accent' : 'bg-text-secondary/10 text-text-secondary'
                      }`}>
                        {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{event.description}</p>
                    
                    {/* Attachments */}
                    {event.attachments.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Icon name="Paperclip" size={14} className="text-text-secondary" />
                        {event.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            className="text-sm text-primary hover:underline"
                          >
                            {attachment.name} ({attachment.size})
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* User and Date */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img 
                            src={event.avatar} 
                            alt={event.user}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-text-secondary text-sm">{event.user}</span>
                      </div>
                      <span className="text-text-secondary text-sm">•</span>
                      <span className="text-text-secondary text-sm">
                        {formatDate(event.date)} at {formatTime(event.date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                      <Icon name="MessageCircle" size={16} />
                    </button>
                    <button className="p-1 text-text-secondary hover:text-error rounded transition-smooth">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading-medium text-text-primary">Add Timeline Event</h4>
              <button
                onClick={() => setShowAddEvent(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Event Title
                </label>
                <Input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm resize-none"
                  placeholder="Enter event description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
                  >
                    <option value="milestone">Milestone</option>
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="document">Document</option>
                    <option value="communication">Communication</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mb-2">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-body-medium text-text-primary mb-2">
                  Assignee
                </label>
                <select
                  value={newEvent.assignee}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm"
                >
                  <option value="">Select assignee</option>
                  <option value="john_doe">John Doe</option>
                  <option value="sarah_johnson">Sarah Johnson</option>
                  <option value="mike_wilson">Mike Wilson</option>
                  <option value="lisa_chen">Lisa Chen</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button variant="ghost" onClick={() => setShowAddEvent(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineTab;