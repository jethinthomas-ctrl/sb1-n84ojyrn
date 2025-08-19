import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { User, Role, Location } from '../../types';
import { Users, Plus, Trash2, MapPin, Phone, Mail, Music, Edit2, Save, X, Shield, User as UserIcon } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const UserProfiles: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: '',
    roles: [] as Role[],
    baseLocation: 'Kharadi' as Location,
    mobileNumber: '',
    email: '',
    userRole: 'Member' as 'Member' | 'Admin',
  });

  const roleOptions: Role[] = ['Guitarist', 'Vocalist', 'Bass', 'Keyboard', 'Cajon'];
  const locationOptions: Location[] = ['Kharadi', 'Baner'];

  const isAdmin = currentUser?.userRole === 'Admin';

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles') // Adjust 'profiles' to your user table name
        .select('*');
      if (error) console.error('Error fetching users:', error);
      else setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.roles.length === 0) {
      alert('Please select at least one role');
      return;
    }

    const user: User = {
      ...newUser,
      id: Date.now().toString(), // Temporary; Supabase will generate a UUID
      createdAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles') // Adjust table name
      .insert([user]);
    if (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Check console for details.');
    } else {
      setUsers(prev => [...prev, user]);
      setNewUser({
        name: '',
        roles: [],
        baseLocation: 'Kharadi',
        mobileNumber: '',
        email: '',
        userRole: 'Member',
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase
        .from('profiles') // Adjust table name
        .delete()
        .eq('id', userId);
      if (error) console.error('Error deleting user:', error);
      else setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'Member' | 'Admin') => {
    if (userId === currentUser?.id && newRole === 'Member') {
      if (!window.confirm('You are about to remove your own admin privileges. Are you sure?')) {
        return;
      }
    }
    
    const { error } = await supabase
      .from('profiles') // Adjust table name
      .update({ userRole: newRole })
      .eq('id', userId);
    if (error) console.error('Error updating role:', error);
    else {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, userRole: newRole } : user
      ));
      setEditingRoleUserId(null);
    }
  };

  const toggleRole = (role: Role) => {
    setNewUser(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const getRoleColor = (role: Role) => {
    const colors = {
      'Guitarist': 'bg-blue-100 text-blue-800',
      'Vocalist': 'bg-purple-100 text-purple-800',
      'Bass': 'bg-green-100 text-green-800',
      'Keyboard': 'bg-orange-100 text-orange-800',
      'Cajon': 'bg-red-100 text-red-800',
    };
    return colors[role];
  };

  if (loading) return <div className="text-center py-12">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors duration-200 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Add User Form Modal */}
      {showAddForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map(role => (
                      <label key={role} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newUser.roles.includes(role)}
                          onChange={() => toggleRole(role)}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Location</label>
                  <select
                    value={newUser.baseLocation}
                    onChange={(e) => setNewUser(prev => ({ ...prev, baseLocation: e.target.value as Location }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={newUser.mobileNumber}
                    onChange={(e) => setNewUser(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                  <select
                    value={newUser.userRole}
                    onChange={(e) => setNewUser(prev => ({ ...prev, userRole: e.target.value as 'Member' | 'Admin' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-black transition-colors font-medium"
                  >
                    Add User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
                  
                  {/* Role Display/Edit */}
                  {isAdmin && editingRoleUserId === user.id ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <select
                        value={user.userRole}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'Member' | 'Admin')}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        autoFocus
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button
                        onClick={() => setEditingRoleUserId(null)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Cancel"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.userRole === 'Admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.userRole}
                    </span>
                  )}
                </div>
                
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingRoleUserId(user.id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="Edit user role"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Music className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <span
                        key={role}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{user.baseLocation}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{user.mobileNumber}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No users registered yet</p>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add the first user
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfiles;