import React, { useState, useEffect } from 'react';
import supabase from './SupabaseClient';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ArrowUpRight } from 'lucide-react';

export default function Info() {
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
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className='relative items-center flex'>
                        <p variant="link" className='font-base text-muted-foreground w-[170px] truncate text-xs cursor-pointer underline text-right 2xl:text-right xl:text-right lg:text-right md:text-right'>{user.user.email}</p>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[240px] rounded-xl">
                        <DropdownMenuLabel className='truncate'>{user.user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                        <p className="text-sm font-light text-muted-foreground text-xs mb-2">
                            Created by <span><a className='underline text-black font-semibold' href='https://dinivannendra.xyz/' target="_blank">dinivan nendra</a></span> for stored your posts
                        </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer' >
                            <span className='text-rose-500 font-semibold'>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    )}
            </div>
        )}
    </div>
    );
}