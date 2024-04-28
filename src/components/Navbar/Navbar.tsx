"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import logo from './logo.png'; // Make sure this path is correct for your logo image
import './Navbar.scss'; 
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const Navbar = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const router = useRouter();
    const checkAdminAuthentication = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.ok) {
                setIsAdminAuthenticated(true);
            } else {
                setIsAdminAuthenticated(false);
            }
        } catch (error) {
            console.error('An error occurred during admin authentication check', error);
            setIsAdminAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAdminAuthentication();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/logout', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                toast.success('Logout Successful');
                setIsAdminAuthenticated(false);
                router.push('/pages/auth/signin'); // Use Next.js router to redirect
            } else {
                toast.error('Logout Failed');
            }
        } catch (error) {
            toast.error('An error occurred during logout');
            console.error('An error occurred during logout', error);
        }
    };

    return (
        <div className='navbar'>
            <Image src={logo} alt="Logo" width={100} />

            <div className='adminlinks'>
                {isAdminAuthenticated ? (
                    <>
                        <Link href='/pages/movie/createmovie'>Add Movie</Link>
                        <Link href='/pages/screen'>Add Screen</Link>
                        <Link href='/pages/schedule'>Add Schedule</Link>
                        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
                    </>
                ) : (
                    <>
                        <Link href='/pages/auth/signin'>Login</Link>
                        <Link href='/pages/auth/signup'>Signup</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
