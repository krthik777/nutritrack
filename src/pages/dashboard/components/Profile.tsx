import React, { useState, useEffect } from "react";
import { User, Save, Plus } from "lucide-react";
import Swal from "sweetalert2";

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
  const [newGoal, setNewGoal] = useState("");
  const [newPreference, setNewPreference] = useState("");
  const email = localStorage.getItem("email") || "";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
      try {
        const BackendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(
          `${BackendUrl}/api/profile?email=${email}`
        );
        const data = await response.json();
        if (data.message === "Profile not found.") {
          setProfile(null);
          setIsEditing(true);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const BackendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(
        `${BackendUrl}/api/profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...profile,
            email,
            goals: profile.goals || [],
            dietaryPreferences: profile.dietaryPreferences || [],
          }),
        }
      );
      if (response.ok) {
        setIsEditing(false);
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        Swal.fire({
          title: "Success",
          text: "Profile saved successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.location.reload();
      }
      else{
        Swal.fire({
          title: "Error",
          text: "An error occurred while saving your profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving your profile. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error saving profile:", error);
      
    }
  };

  const handleAddItem = (type: "goals" | "dietaryPreferences", value: string) => {
    if (!value.trim()) return;
    setProfile((prev) => ({
      ...(prev || { name: "", email, phone: "", location: "", height: "", weight: "", goals: [], dietaryPreferences: [] }),
      [type]: [...(prev?.[type] || []), value.trim()],
    }));
    type === "goals" ? setNewGoal("") : setNewPreference("");
  };

  if (!profile || isEditing) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">{profile ? "Edit Profile" : "Create Profile"}</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["name", "phone", "location", "height", "weight"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                value={profile?.[field as keyof ProfileData] || ""}
                onChange={(e) => setProfile({ ...profile!, [field]: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="text" value={email} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed" />
          </div>
          {[{ label: "Goals", value: newGoal, setter: setNewGoal, type: "goals" },
            { label: "Dietary Preferences", value: newPreference, setter: setNewPreference, type: "dietaryPreferences" }].map(({ label, value, setter, type }) => (
            <div key={type} className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex gap-2">
                <input type="text" value={value} onChange={(e) => setter(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <button type="button" onClick={() => handleAddItem(type as "goals" | "dietaryPreferences", value)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  <Plus className="h-5 w-5 inline" />
                </button>
              </div>
            </div>
          ))}
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            <Save className="h-5 w-5 inline" /> {profile ? "Save Changes" : "Create Profile"}
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
        {Object.entries(profile).map(([key, value]) => key !== "_id" && (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <p className="text-gray-700">{Array.isArray(value) ? value.join(", ") : value}</p>
          </div>
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
