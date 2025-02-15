import React, { useState, useEffect } from 'react';
import { User, Save, Plus } from 'lucide-react';

interface ProfileData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  height: string;
  weight: string;
  goals: string[];
  dietaryPreferences: string[];
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [newGoal, setNewGoal] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
      try {
        const response = await fetch(`https://backend-production-d4c8.up.railway.app/api/profile?email=${email}`);
        const data = await response.json();
        if (data) setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const response = await fetch('https://backend-production-d4c8.up.railway.app/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, email }),
      });
      if (response.ok) setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setProfile(prev => prev ? { ...prev, goals: [...prev.goals, newGoal.trim()] } : prev);
      setNewGoal('');
    }
  };

  const handleAddPreference = () => {
    if (newPreference.trim()) {
      setProfile(prev => prev ? { ...prev, dietaryPreferences: [...prev.dietaryPreferences, newPreference.trim()] } : prev);
      setNewPreference('');
    }
  };

  if (!profile || isEditing) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['name', 'phone', 'location', 'height', 'weight'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                value={profile?.[field as keyof ProfileData] || ''}
                onChange={e => setProfile(prev => prev ? { ...prev, [field]: e.target.value } : prev)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="text"
              value={email || ''}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button type="button" onClick={handleAddGoal} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Plus className="h-5 w-5 inline" />
              </button>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPreference}
                onChange={e => setNewPreference(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button type="button" onClick={handleAddPreference} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Plus className="h-5 w-5 inline" />
              </button>
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            <Save className="h-5 w-5 inline" /> {profile ? 'Save Changes' : 'Create Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <User className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Profile</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(profile).map(([key, value]) => (
          key !== '_id' && (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <p className="text-gray-700">{Array.isArray(value) ? value.join(', ') : value}</p>
            </div>
          )
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button onClick={() => setIsEditing(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          <Save className="h-5 w-5 inline" /> Edit Profile
        </button>
      </div>
    </div>
  );
}
