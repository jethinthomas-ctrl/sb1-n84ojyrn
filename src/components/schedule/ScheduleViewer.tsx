import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Lineup, User } from '../../types';
import { Calendar, MapPin, Music, Filter, Users, Phone, Mail } from 'lucide-react';

const ScheduleViewer: React.FC = () => {
  const [lineups] = useLocalStorage<Lineup[]>('lineups', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const [sortBy, setSortBy] = useState<'date' | 'location'>('date');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  const getUserDetails = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const sortedAndFilteredLineups = () => {
    let filtered = lineups;

    // Filter by location if selected
    if (filterLocation !== 'all') {
      filtered = filtered.filter(lineup => lineup.location === filterLocation);
    }

    // Sort by date or location
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.location.localeCompare(b.location);
      }
    });
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Guitarist': 'bg-blue-100 text-blue-800',
      'Vocalist': 'bg-purple-100 text-purple-800',
      'Bass': 'bg-green-100 text-green-800',
      'Keyboard': 'bg-orange-100 text-orange-800',
      'Cajon': 'bg-red-100 text-red-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isUpcoming = (date: string) => {
    const today = new Date();
    const lineupDate = new Date(date);
    return lineupDate >= today;
  };

  const upcomingLineups = sortedAndFilteredLineups().filter(lineup => isUpcoming(lineup.date));
  const pastLineups = sortedAndFilteredLineups().filter(lineup => !isUpcoming(lineup.date));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Schedule View</h1>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'location')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>

          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="all">All Locations</option>
            <option value="Kharadi">Kharadi</option>
            <option value="Baner">Baner</option>
          </select>
        </div>
      </div>

      {/* Upcoming Lineups */}
      {upcomingLineups.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Upcoming Services
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingLineups.map(lineup => (
              <div key={lineup.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Calendar className="h-5 w-5" />
                        <span className="font-bold">
                          {new Date(lineup.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{lineup.location}</span>
                      </div>
                    </div>
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Upcoming
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{lineup.members.length} members</span>
                    </div>

                    {lineup.members.map((member, index) => {
                      const userDetails = getUserDetails(member.userId);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              {userDetails && (
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{userDetails.mobileNumber}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{userDetails.email}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-600">
                      Created {new Date(lineup.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Lineups */}
      {pastLineups.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Past Services
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastLineups.map(lineup => (
              <div key={lineup.id} className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden opacity-75">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span className="font-bold">
                          {new Date(lineup.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{lineup.location}</span>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">{lineup.members.length} members</span>
                    </div>

                    {lineup.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                        <span className="text-gray-700">{member.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Created {new Date(lineup.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {lineups.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No lineups created yet</p>
          <p className="text-gray-400 mt-2">Create your first lineup to see it here</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleViewer;