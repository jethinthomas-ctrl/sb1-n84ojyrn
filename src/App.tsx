import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import UserProfiles from './components/profiles/UserProfiles';
import AvailabilityManager from './components/availability/AvailabilityManager';
import LineupCreator from './components/lineup/LineupCreator';
import ScheduleViewer from './components/schedule/ScheduleViewer';
import SetlistManager from './components/setlist/SetlistManager';
import NotificationInfo from './components/notifications/NotificationInfo';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profiles');

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profiles':
        return <UserProfiles />;
      case 'availability':
        return <AvailabilityManager />;
      case 'lineup':
        return <LineupCreator />;
      case 'schedule':
        return <ScheduleViewer />;
      case 'setlist':
        return <SetlistManager />;
      case 'notifications':
        return <NotificationInfo />;
      default:
        return <UserProfiles />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;