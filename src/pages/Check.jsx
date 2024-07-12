import React, { useState, useEffect } from 'react';
import supabase from './SupabaseClient';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

export default function Check() {
    const [user, setUser] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
  
    const fetchUserProfile = async () => {
      try {
        const { data: user, error } = await supabase.auth.getUser();
    
        if (error) {
          console.error('Error fetching user profile:', error.message);
          return;
        }
    
        // console.log('Fetched user profile:', user);
        setUser(user);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    
    
    
    useEffect(() => {
      // console.log('Fetching user profile...');
      fetchUserProfile();
    }, []);
  
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
  
        if (error) {
          console.error('Error logging out:', error.message);
          return;
        }
  
        // Show a snackbar
        setSnackbarMessage('Logout successful!');
        setTimeout(() => {
          setSnackbarMessage('');
        }, 3000);
  
        // Redirect to the login page after successful logout
        navigate('/');
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    return (
      <div>
        {user && (
            <div className='flex gap-x-2 my-1 items-center'>
                {user && (
                    <Link to='/writings' className='rounded-full bg-black text-white text-xs flex items-center px-3 py-2 gap-x-2'> <Edit className='w-3 h-3' /> Edit </Link>
                    )}
            </div>
        )}
    </div>
    );
}