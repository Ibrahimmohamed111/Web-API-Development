import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css'; // Import CSS file for styling

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    useEffect(() => {
        fetch("http://localhost:5000/authorize", {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                console.log("rws ", res)
                if (res.token) {
                    setIsLoggedIn(true)

                }
                else {
                    setIsLoggedIn(false)
                }

            })
    }, [])

    const deleteAllCookies = () => {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }
    };



    const handleLogout = async () => {
        try {
            // Make API call to logout
            await axios.get('http://localhost:5000/logout');
            // Call the function to delete all cookies
            deleteAllCookies();
            setIsLoggedIn(false); // Update login status
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* <img src="/company-logo.png" alt="Company Logo" /> */}
                <span>Recipe Finder</span>
            </div>
            <div className="navbar-buttons">
                {isLoggedIn ? ( // Conditional rendering based on login status
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <button>Login</button>
                        <button>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
