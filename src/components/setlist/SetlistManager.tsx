import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Setlist, Song, Location } from '../../types';
import { Music, Plus, Calendar, MapPin, Trash2, Edit2, Save, X } from 'lucide-react';

const SetlistManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [setlists, setSetlists] = useLocalStorage<Setlist[]>('setlists', []);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSetlistId, setEditingSetlistId] = useState<string | null>(null);
  const [selectedSetlist, setSelectedSetlist] = useState<string | null>(null);

  const [newSetlist, setNewSetlist] = useState({
    date: '',
    location: 'Kharadi' as Location,
    songs: [] as Song[],
  });

  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    key: '',
    notes: '',
  });

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

  const handleAddSong = () => {
    if (!newSong.title) return;

    const song: Song = {
      id: Date.now().toString(),
      ...newSong,
    };

    setNewSetlist(prev => ({
      ...prev,
      songs: [...prev.songs, song]
    }));

    setNewSong({
      title: '',
      artist: '',
      key: '',
      notes: '',
    });
  };

  const handleRemoveSong = (songId: string) => {
    setNewSetlist(prev => ({
      ...prev,
      songs: prev.songs.filter(song => song.id !== songId)
    }));
  };

  const handleCreateSetlist = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSetlist.date || newSetlist.songs.length === 0) {
      alert('Please select a date and add at least one song');
      return;
    }

    const setlist: Setlist = {
      id: Date.now().toString(),
      ...newSetlist,
      createdBy: currentUser?.id || '',
      createdAt: new Date().toISOString(),
    };

    setSetlists(prev => [...prev, setlist]);
    
    setNewSetlist({
      date: '',
      location: 'Kharadi',
      songs: [],
    });
    
    setShowCreateForm(false);
    alert('Setlist created successfully!');
  };

  const handleDeleteSetlist = (setlistId: string) => {
    if (window.confirm('Are you sure you want to delete this setlist?')) {
      setSetlists(prev => prev.filter(setlist => setlist.id !== setlistId));
    }
  };

  const sortedSetlists = setlists.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getSelectedSetlistDetails = () => {
    return setlists.find(setlist => setlist.id === selectedSetlist);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Music className="h-8 w-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Setlist Management</h1>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Create Setlist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setlists List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Setlists</h2>
            
            <div className="space-y-3">
              {sortedSetlists.map(setlist => (
                <div
                  key={setlist.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedSetlist === setlist.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSetlist(setlist.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(setlist.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{setlist.location}</span>
                        <span>•</span>
                        <span>{setlist.songs.length} songs</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSetlist(setlist.id);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedSetlists.length === 0 && (
              <p className="text-gray-500 text-center py-8">No setlists created yet</p>
            )}
          </div>
        </div>

        {/* Setlist Details */}
        <div className="lg:col-span-2">
          {selectedSetlist ? (
            <SetlistDetails setlist={getSelectedSetlistDetails()!} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a setlist to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Setlist Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Setlist</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSetlist} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <select
                      value={newSetlist.date}
                      onChange={(e) => setNewSetlist(prev => ({ ...prev, date: e.target.value }))}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={newSetlist.location}
                      onChange={(e) => setNewSetlist(prev => ({ ...prev, location: e.target.value as Location }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="Kharadi">Kharadi</option>
                      <option value="Baner">Baner</option>
                    </select>
                  </div>
                </div>

                {/* Add Song Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Add Songs</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Song Title *"
                      value={newSong.title}
                      onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Artist"
                      value={newSong.artist}
                      onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Key (e.g., G, Am, C#)"
                      value={newSong.key}
                      onChange={(e) => setNewSong(prev => ({ ...prev, key: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddSong}
                      disabled={!newSong.title}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Song
                    </button>
                  </div>
                  
                  <textarea
                    placeholder="Notes (optional)"
                    value={newSong.notes}
                    onChange={(e) => setNewSong(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                {/* Songs List */}
                {newSetlist.songs.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Songs in Setlist ({newSetlist.songs.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {newSetlist.songs.map((song, index) => (
                        <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {index + 1}. {song.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {song.artist && `${song.artist}`}
                              {song.key && ` • Key: ${song.key}`}
                            </div>
                            {song.notes && (
                              <div className="text-sm text-gray-600 mt-1">{song.notes}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSong(song.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={!newSetlist.date || newSetlist.songs.length === 0}
                    className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Create Setlist
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
    </div>
  );
};

// Separate component for setlist details
const SetlistDetails: React.FC<{ setlist: Setlist }> = ({ setlist }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {new Date(setlist.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h2>
          <div className="flex items-center space-x-4 text-gray-600 mt-2">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{setlist.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Music className="h-4 w-4" />
              <span>{setlist.songs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {setlist.songs.map((song, index) => (
          <div key={song.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{song.title}</h3>
                    {song.artist && (
                      <p className="text-gray-600 text-sm">by {song.artist}</p>
                    )}
                  </div>
                </div>
                
                <div className="ml-11">
                  {song.key && (
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium mr-2">
                      Key: {song.key}
                    </span>
                  )}
                  {song.notes && (
                    <p className="text-gray-600 text-sm mt-2">{song.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {setlist.songs.length === 0 && (
        <div className="text-center py-8">
          <Music className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No songs in this setlist</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Created on {new Date(setlist.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default SetlistManager;