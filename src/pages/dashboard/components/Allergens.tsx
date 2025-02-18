import { useState, useEffect } from 'react';
import { AlertCircle, Search, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CirclesWithBar } from 'react-loader-spinner';

export function Allergens() {
  interface Allergen {
    _id: string;
    name: string;
    severity: 'High' | 'Medium' | 'Low';
    notes: string;
    email: string;
  }

  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAllergen, setNewAllergen] = useState({ name: '', severity: 'Medium', notes: '', email: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCommonAllergen, setSelectedCommonAllergen] = useState<string | null>(null);
  const [isSeverityDialogOpen, setIsSeverityDialogOpen] = useState(false);
  const [commonAllergenSeverity, setCommonAllergenSeverity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [commonAllergenNotes, setCommonAllergenNotes] = useState('');

  const commonAllergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts',
    'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
  ];

  // Fetch allergens from the backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllergens = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email not found. Please log in again.',
          confirmButtonText: 'OK',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://military-maridel-k-rthik-de59a126.koyeb.app/api/allergens', {
          params: { email },
        });
        setAllergens(response.data);
      } catch (error) {
        console.error('Error fetching allergens:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch allergens. Please try again later.',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllergens();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8 flex items-center justify-center">
        <CirclesWithBar/>
        
      </div>
    );
  }

  const filteredAllergens = allergens.filter(allergen =>
    allergen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allergen.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAllergen = async () => {
    if (!newAllergen.name) return;

    const email = localStorage.getItem('email');
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email not found. Please log in again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const allergenToAdd = { ...newAllergen, email };

    try {
      const response = await axios.post('https://military-maridel-k-rthik-de59a126.koyeb.app/api/allergens', allergenToAdd);
      setAllergens(prev => [...prev, response.data]);
      setNewAllergen({ name: '', severity: 'Medium', notes: '', email: '' });
      setIsDialogOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Allergen added successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding allergen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add allergen. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleRemoveAllergen = async (id: string) => {
    try {
      await axios.delete(`https://military-maridel-k-rthik-de59a126.koyeb.app/api/allergens/${id}`);
      setAllergens(prev => prev.filter(allergen => allergen._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Allergen removed successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error removing allergen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove allergen. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCommonAllergenClick = (name: string) => {
    if (allergens.some(a => a.name.toLowerCase() === name.toLowerCase())) {
      return; // Already exists
    }

    setSelectedCommonAllergen(name);
    setIsSeverityDialogOpen(true);
  };

  const handleAddCommonAllergen = async () => {
    if (!selectedCommonAllergen) return;

    const email = localStorage.getItem('email');
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email not found. Please log in again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const allergenToAdd = {
      name: selectedCommonAllergen,
      severity: commonAllergenSeverity,
      notes: commonAllergenNotes,
      email,
    };

    try {
      const response = await axios.post('https://military-maridel-k-rthik-de59a126.koyeb.app/api/allergens', allergenToAdd);
      setAllergens(prev => [...prev, response.data]);

      // Reset the form
      setSelectedCommonAllergen(null);
      setCommonAllergenSeverity('Medium');
      setCommonAllergenNotes('');
      setIsSeverityDialogOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Common allergen added successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding common allergen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add common allergen. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">My Allergens</h3>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Allergen
          </button>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h4 className="text-xl font-semibold mb-4">Add New Allergen</h4>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-gray-700">Allergen Name</label>
                  <input
                    id="name"
                    value={newAllergen.name}
                    onChange={(e) => setNewAllergen(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter allergen name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="severity" className="block text-gray-700">Severity</label>
                  <select
                    value={newAllergen.severity}
                    onChange={(e) => setNewAllergen(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-gray-700">Notes</label>
                  <textarea
                    id="notes"
                    value={newAllergen.notes}
                    onChange={(e) => setNewAllergen(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Add any important notes"
                  />
                </div>
                <button 
                  className="w-full bg-green-600 text-white py-2 rounded mt-4"
                  onClick={handleAddAllergen}
                  disabled={!newAllergen.name}
                >
                  Add Allergen
                </button>
                <button className="w-full bg-gray-500 text-white py-2 rounded mt-2" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search allergens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="space-y-4">
          {filteredAllergens.map((allergen) => (
            <div key={allergen._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">{allergen.name}</h4>
                  <p className="text-sm text-gray-600">{allergen.notes}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  allergen.severity === 'High' ? 'bg-red-100 text-red-800' :
                  allergen.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {allergen.severity}
                </span>
                <button 
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={() => handleRemoveAllergen(allergen._id)}
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
          {filteredAllergens.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No allergens found
            </div>
          )}
        </div>
      </div>

      {isSeverityDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h4 className="text-xl font-semibold mb-4">Add {selectedCommonAllergen}</h4>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="severity" className="block text-gray-700">Severity</label>
                <select
                  value={commonAllergenSeverity}
                  onChange={(e) => setCommonAllergenSeverity(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-gray-700">Notes</label>
                <textarea
                  id="notes"
                  value={commonAllergenNotes}
                  onChange={(e) => setCommonAllergenNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Add any important notes"
                />
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded mt-4" onClick={handleAddCommonAllergen}>
                Add {selectedCommonAllergen}
              </button>
              <button className="w-full bg-gray-500 text-white py-2 rounded mt-2" onClick={() => setIsSeverityDialogOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Allergens</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {commonAllergens.map((item) => (
            <button
              key={item}
              className="p-3 border border-gray-200 rounded-lg text-left hover:border-green-500 hover:bg-green-50 transition-colors"
              onClick={() => handleCommonAllergenClick(item)}
              disabled={allergens.some(a => a.name.toLowerCase() === item.toLowerCase())}
            >
              <span className={allergens.some(a => a.name.toLowerCase() === item.toLowerCase()) ? 'text-gray-400' : 'text-gray-800'}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}