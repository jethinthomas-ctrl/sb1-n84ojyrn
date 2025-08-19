import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, Availability } from '../../types';
import { Calendar, Check, X, Plus, User as UserIcon } from 'lucide-react';

const AvailabilityManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [users] = useLocalStorage<User[]>('users', []);
  const [availabilities, setAvailabilities] = useLocalStorage<Availability[]>('availabilities', []);
  
  const [selectedUser, setSelectedUser] = useState(currentUser?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Yes' | 'No'>('Yes');

  const isAdmin = currentUser?.userRole === 'Admin';

  // Generate next 30 days from today
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !selectedDate) return;

    // Check if availability already exists for this user and date
    const existingIndex = availabilities.findIndex(
      av => av.userId === selectedUser && av.date === selectedDate
    );

    const newAvailability: Availability = {
      id: Date.now().toString(),
      userId: selectedUser,
      date: selectedDate,
      status: selectedStatus,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing availability
      setAvailabilities(prev => prev.map((av, index) => 
        index === existingIndex ? newAvailability : av
      ));
    } else {
      // Add new availability
      setAvailabilities(prev => [...prev, newAvailability]);
    }

    setSelectedDate('');
  };

  const getUserAvailabilities = (userId: string) => {
    return availabilities
      .filter(av => av.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getAvailabilityForDate = (userId: string, date: string) => {
    return availabilities.find(av => av.userId === userId && av.date === date);
  };

  const getStatusColor = (status: 'Yes' | 'No') => {
    return status === 'Yes' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getUserName = (userId: string) => {
    return users.find(user => user.id === userId)?.name || 'Unknown User';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <Calendar className="h-8 w-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
      </div>

      {/* Add Availability Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Set Availability
        </h2>

        <form onSubmit={handleAddAvailability} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isAdmin ? 'Select User' : 'User'}
            </label>
            {isAdmin ? (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            ) : (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                {currentUser?.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              required
            >
              <option value="">Select a date</option>
              {dateOptions.map(date => (
                <option key={date.value} value={date.value}>{date.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'Yes' | 'No')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="Yes">Available</option>
              <option value="No">Not Available</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!selectedUser || !selectedDate}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Set Availability
            </button>
          </div>
        </form>
      </div>

      {/* Availability Calendar View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability Overview</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                {dateOptions.slice(0, 14).map(date => (
                  <th key={date.value} className="text-center py-3 px-2 font-semibold text-gray-900 min-w-20">
                    <div className="text-xs">{date.label}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  {dateOptions.slice(0, 14).map(date => {
                    const availability = getAvailabilityForDate(user.id, date.value);
                    return (
                      <td key={date.value} className="py-3 px-2 text-center">
                        {availability ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(availability.status)}`}>
                            {availability.status === 'Yes' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found. Please add users first.</p>
          </div>
        )}
      </div>

      {/* User's Personal Availability */}
      {currentUser && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Availability</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getUserAvailabilities(currentUser.id).map(availability => (
              <div
                key={availability.id}
                className={`p-4 rounded-lg border ${getStatusColor(availability.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {new Date(availability.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm">
                      {availability.status === 'Yes' ? 'Available' : 'Not Available'}
                    </div>
                  </div>
                  {availability.status === 'Yes' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {getUserAvailabilities(currentUser.id).length === 0 && (
            <p className="text-gray-500 text-center py-4">You haven't set any availability yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;