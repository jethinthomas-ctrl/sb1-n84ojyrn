import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, Availability, Lineup, LineupMember, Role, Location } from '../../types';
import { Music, Calendar, MapPin, Users, Plus, Save } from 'lucide-react';

const LineupCreator: React.FC = () => {
  const { currentUser } = useAuth();
  const [users] = useLocalStorage<User[]>('users', []);
  const [availabilities] = useLocalStorage<Availability[]>('availabilities', []);
  const [lineups, setLineups] = useLocalStorage<Lineup[]>('lineups', []);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location>('Kharadi');
  const [selectedMembers, setSelectedMembers] = useState<LineupMember[]>([]);

  const isAdmin = currentUser?.userRole === 'Admin';

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Admin access required to create lineups.</p>
        </div>
      </div>
    );
  }

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
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Get available users for selected date
  const getAvailableUsers = () => {
    if (!selectedDate) return [];
    
    return users.filter(user => {
      const availability = availabilities.find(
        av => av.userId === user.id && av.date === selectedDate && av.status === 'Yes'
      );
      return availability !== undefined;
    });
  };

  // Get users by role who are available
  const getUsersByRole = (role: Role) => {
    return getAvailableUsers().filter(user => user.roles.includes(role));
  };

  const roleOptions: Role[] = ['Guitarist', 'Vocalist', 'Bass', 'Keyboard', 'Cajon'];

  const addMemberToLineup = (user: User, role: Role) => {
    const existingMember = selectedMembers.find(member => member.userId === user.id && member.role === role);
    if (existingMember) return;

    const newMember: LineupMember = {
      userId: user.id,
      role,
      name: user.name,
    };

    setSelectedMembers(prev => [...prev, newMember]);
  };

  const removeMemberFromLineup = (userId: string, role: Role) => {
    setSelectedMembers(prev => prev.filter(member => !(member.userId === userId && member.role === role)));
  };

  const handleCreateLineup = () => {
    if (!selectedDate || selectedMembers.length === 0) {
      alert('Please select a date and at least one member');
      return;
    }

    const newLineup: Lineup = {
      id: Date.now().toString(),
      date: selectedDate,
      location: selectedLocation,
      members: selectedMembers,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || '',
    };

    setLineups(prev => [...prev, newLineup]);
    setSelectedMembers([]);
    setSelectedDate('');
    alert('Lineup created successfully!');
  };

  const getRoleColor = (role: Role) => {
    const colors = {
      'Guitarist': 'bg-blue-100 text-blue-800 border-blue-200',
      'Vocalist': 'bg-purple-100 text-purple-800 border-purple-200',
      'Bass': 'bg-green-100 text-green-800 border-green-200',
      'Keyboard': 'bg-orange-100 text-orange-800 border-orange-200',
      'Cajon': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[role];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <Music className="h-8 w-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Create Lineup</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Service Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">Select a date</option>
                  {dateOptions.map(date => (
                    <option key={date.value} value={date.value}>{date.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value as Location)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="Kharadi">Kharadi</option>
                  <option value="Baner">Baner</option>
                </select>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Available Members
              </h2>

              <div className="space-y-4">
                {roleOptions.map(role => {
                  const availableUsers = getUsersByRole(role);
                  return (
                    <div key={role} className="border border-gray-200 rounded-lg p-4">
                      <h3 className={`font-medium mb-3 px-3 py-1 rounded-full text-sm inline-block ${getRoleColor(role)}`}>
                        {role}
                      </h3>
                      
                      {availableUsers.length > 0 ? (
                        <div className="space-y-2">
                          {availableUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {user.baseLocation}
                                </div>
                              </div>
                              <button
                                onClick={() => addMemberToLineup(user, role)}
                                disabled={selectedMembers.some(m => m.userId === user.id && m.role === role)}
                                className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No available {role.toLowerCase()}s</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {getAvailableUsers().length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No members available for selected date
                </p>
              )}
            </div>
          )}
        </div>

        {/* Lineup Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Music className="h-5 w-5 mr-2" />
              Lineup Preview
            </h2>
            {selectedMembers.length > 0 && (
              <button
                onClick={handleCreateLineup}
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Create Lineup</span>
              </button>
            )}
          </div>

          {selectedDate && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4 text-gray-800">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{selectedLocation}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {selectedMembers.length > 0 ? (
              <div className="space-y-3">
                {selectedMembers.map((member, index) => (
                  <div key={`${member.userId}-${member.role}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                    <button
                      onClick={() => removeMemberFromLineup(member.userId, member.role)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a date and add members to create a lineup</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineupCreator;