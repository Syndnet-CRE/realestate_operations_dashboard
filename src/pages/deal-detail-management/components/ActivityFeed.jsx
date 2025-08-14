import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ActivityFeed = ({ dealId, onActivityAdd }) => {
  const [newComment, setNewComment] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const activityTypes = [
    { id: 'all', label: 'All Activity', icon: 'Activity' },
    { id: 'comments', label: 'Comments', icon: 'MessageCircle' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'status', label: 'Status Changes', icon: 'RefreshCw' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'meetings', label: 'Meetings', icon: 'Calendar' }
  ];

  const activities = [
    {
      id: 1,
      type: 'comment',
      user: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      action: 'added a comment',
      content: `The financial analysis looks promising. The ROI calculations show a strong return potential of 22%, which exceeds our target threshold.\n\nI recommend we proceed with the due diligence phase and schedule the property inspection for next week.`,
      timestamp: '2024-01-17T14:30:00Z',
      attachments: [],
      mentions: ['Sarah Johnson'],
      reactions: [
        { emoji: '👍', count: 3, users: ['Sarah Johnson', 'Mike Wilson', 'Lisa Chen'] },
        { emoji: '💡', count: 1, users: ['David Brown'] }
      ]
    },
    {
      id: 2,
      type: 'document',
      user: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      action: 'uploaded a document',
      content: 'Financial Analysis Report - Q1 2024.xlsx',
      timestamp: '2024-01-17T11:15:00Z',
      attachments: [
        { name: 'Financial Analysis Report - Q1 2024.xlsx', size: '2.4 MB', type: 'excel' }
      ],
      mentions: [],
      reactions: []
    },
    {
      id: 3,
      type: 'status',
      user: 'System',
      avatar: null,
      action: 'changed deal status',
      content: 'Deal status changed from "Pipeline" to "Active"',
      timestamp: '2024-01-16T16:45:00Z',
      attachments: [],
      mentions: [],
      reactions: []
    },
    {
      id: 4,
      type: 'task',
      user: 'Mike Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      action: 'completed task',
      content: 'Property Inspection Report - Completed all structural assessments and documented findings',
      timestamp: '2024-01-16T09:20:00Z',
      attachments: [
        { name: 'Property_Inspection_Report.pdf', size: '5.2 MB', type: 'pdf' }
      ],
      mentions: ['John Doe'],
      reactions: [
        { emoji: '✅', count: 2, users: ['John Doe', 'Lisa Chen'] }
      ]
    },
    {
      id: 5,
      type: 'meeting',
      user: 'Lisa Chen',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      action: 'scheduled a meeting',
      content: 'Legal Review Meeting - January 22, 2024 at 2:00 PM\nDiscuss purchase agreement terms and closing timeline',
      timestamp: '2024-01-15T13:10:00Z',
      attachments: [],
      mentions: ['John Doe', 'Sarah Johnson'],
      reactions: []
    },
    {
      id: 6,
      type: 'comment',
      user: 'David Brown',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      action: 'added a comment',
      content: 'Market analysis shows comparable properties in the area are selling 15% above asking price. This supports our ARV estimates.',
      timestamp: '2024-01-15T10:45:00Z',
      attachments: [],
      mentions: [],
      reactions: [
        { emoji: '📊', count: 1, users: ['Sarah Johnson'] }
      ]
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return 'MessageCircle';
      case 'document': return 'FileText';
      case 'status': return 'RefreshCw';
      case 'task': return 'CheckSquare';
      case 'meeting': return 'Calendar';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment': return 'text-primary';
      case 'document': return 'text-warning';
      case 'status': return 'text-success';
      case 'task': return 'text-accent';
      case 'meeting': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = activities.filter(activity => 
    filterType === 'all' || activity.type === filterType.slice(0, -1)
  );

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      type: 'comment',
      user: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      action: 'added a comment',
      content: newComment,
      timestamp: new Date().toISOString(),
      attachments: [],
      mentions: [],
      reactions: []
    };

    console.log('Adding comment:', comment);
    setNewComment('');
    setShowCommentForm(false);
    
    if (onActivityAdd) {
      onActivityAdd(comment);
    }
  };

  const handleReaction = (activityId, emoji) => {
    console.log(`Adding reaction ${emoji} to activity ${activityId}`);
  };

  const handleMention = (username) => {
    setNewComment(prev => prev + `@${username} `);
  };

  return (
    <div className="bg-surface border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-body-medium text-text-primary">Activity Feed</h4>
          <Button 
            variant="primary" 
            onClick={() => setShowCommentForm(true)}
            iconName="MessageCircle"
            className="text-sm px-3 py-1"
          >
            Comment
          </Button>
        </div>
        
        {/* Activity Filters */}
        <div className="flex flex-wrap gap-1">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-smooth ${
                filterType === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
              }`}
            >
              <Icon name={type.icon} size={12} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="px-6 py-4 border-b border-border bg-background">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth text-sm resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <span>@mention team members</span>
                <button
                  onClick={() => handleMention('John Doe')}
                  className="text-primary hover:underline"
                >
                  @John
                </button>
                <button
                  onClick={() => handleMention('Sarah Johnson')}
                  className="text-primary hover:underline"
                >
                  @Sarah
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => setShowCommentForm(false)} className="text-sm">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAddComment} className="text-sm">
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {activity.avatar ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={activity.avatar} 
                      alt={activity.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-text-secondary/20 flex items-center justify-center">
                    <Icon name="Settings" size={16} className="text-text-secondary" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={getActivityIcon(activity.type)} 
                    size={14} 
                    className={getActivityColor(activity.type)} 
                  />
                  <span className="font-body-medium text-text-primary text-sm">
                    {activity.user}
                  </span>
                  <span className="text-text-secondary text-sm">{activity.action}</span>
                  <span className="text-text-secondary text-xs">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>

                {/* Activity Content */}
                <div className="bg-background rounded-lg p-3 mb-3">
                  <div className="text-text-primary text-sm whitespace-pre-wrap">
                    {activity.content}
                  </div>
                  
                  {/* Mentions */}
                  {activity.mentions.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2 text-xs">
                      <Icon name="AtSign" size={12} className="text-text-secondary" />
                      <span className="text-text-secondary">Mentioned:</span>
                      {activity.mentions.map((mention, index) => (
                        <span key={index} className="text-primary">
                          @{mention}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {activity.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {activity.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-surface rounded border border-border">
                          <Icon 
                            name={attachment.type === 'pdf' ? 'FileText' : 'FileSpreadsheet'} 
                            size={16} 
                            className="text-text-secondary" 
                          />
                          <span className="text-text-primary text-sm font-body-medium">
                            {attachment.name}
                          </span>
                          <span className="text-text-secondary text-xs">
                            ({attachment.size})
                          </span>
                          <button className="ml-auto p-1 text-text-secondary hover:text-text-primary rounded transition-smooth">
                            <Icon name="Download" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {activity.reactions.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    {activity.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => handleReaction(activity.id, reaction.emoji)}
                        className="flex items-center space-x-1 px-2 py-1 bg-background hover:bg-border rounded-full text-xs transition-smooth"
                        title={reaction.users.join(', ')}
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-text-secondary">{reaction.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleReaction(activity.id, '👍')}
                      className="p-1 text-text-secondary hover:text-text-primary rounded transition-smooth"
                      title="Add reaction"
                    >
                      <Icon name="Plus" size={12} />
                    </button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center space-x-3 text-xs text-text-secondary">
                  <button className="hover:text-text-primary transition-smooth">
                    Reply
                  </button>
                  <button className="hover:text-text-primary transition-smooth">
                    Share
                  </button>
                  {activity.type === 'comment' && (
                    <button className="hover:text-text-primary transition-smooth">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;