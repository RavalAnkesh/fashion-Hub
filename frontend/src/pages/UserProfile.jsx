import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { token, backendUrl, navigate, setToken } = useContext(ShopContext);
  const [user, setUser] = useState(null);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error(response.data.message || 'User profile not found');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user profile');
      }
    };

    fetchUser();
  }, [token, backendUrl, navigate]);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>
      <div className="border p-5 bg-white rounded shadow space-y-4">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {/* Add more profile details here */}
        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-2 rounded mt-4 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
