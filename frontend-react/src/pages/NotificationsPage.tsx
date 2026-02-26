import React from 'react';
import { Bell, Check, Trash2, Info, Trophy, Calendar, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { AdapterNotification } from '../types/adapter';
interface NotificationsPageProps {
  notifications: AdapterNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}
export function NotificationsPage({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClear
}: NotificationsPageProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'win':
        return <Trophy size={20} className="text-amber-500" />;
      case 'draw':
        return <Calendar size={20} className="text-blue-500" />;
      case 'promo':
        return <Star size={20} className="text-purple-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your latest activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <Check size={16} className="mr-1" /> Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-500 hover:text-red-600 hover:bg-red-50">

            <Trash2 size={16} className="mr-1" /> Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ?
        notifications.map((notification) =>
        <Card
          key={notification.id}
          className={`transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
          onClick={() => onMarkRead(notification.id)}>

              <div className="flex gap-4">
                <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-sm`}>

                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                  className={`font-bold ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>

                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {notification.date}
                    </span>
                  </div>
                  <p
                className={`text-sm ${notification.read ? 'text-gray-600' : 'text-blue-800'}`}>

                    {notification.message}
                  </p>
                </div>
                {!notification.read &&
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            }
              </div>
            </Card>
        ) :

        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              No notifications
            </h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        }
      </div>
    </div>);

}