export interface User {
  id: string;
  name: string;
  roles: Role[];
  baseLocation: Location;
  mobileNumber: string;
  email: string;
  userRole: 'Member' | 'Admin';
  createdAt: string;
}

export type Role = 'Guitarist' | 'Vocalist' | 'Bass' | 'Keyboard' | 'Cajon';
export type Location = 'Kharadi' | 'Baner';

export interface Availability {
  id: string;
  userId: string;
  date: string;
  status: 'Yes' | 'No';
  createdAt: string;
}

export interface Lineup {
  id: string;
  date: string;
  location: Location;
  members: LineupMember[];
  createdAt: string;
  createdBy: string;
}

export interface LineupMember {
  userId: string;
  role: Role;
  name: string;
}

export interface Setlist {
  id: string;
  date: string;
  location: Location;
  songs: Song[];
  createdBy: string;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;
  notes?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}