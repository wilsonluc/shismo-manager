"use client";

import React, { useEffect, useState, useRef } from "react";
import { CHARS_ENDPOINT } from "../../app/endpoints";

interface AccountProps {
  setCharacterName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Account: React.FC<AccountProps> = ({ setCharacterName }) => {
  const [user, setUser] = useState<any>(null); // Store the user object
  const [loading, setLoading] = useState(true); // To manage loading state
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Reference to the dropdown menu
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Reference to the account management button

  const [characters, setCharacters] = useState<string[]>([]); // Store character names from dynamoDB

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Fetch the user data from the /api/user route
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();

        // If the user is authenticated, store the user data in state
        if (data.user) {
          setUser(data.user);

          // Fetch from dynamoDB
          const charResponse = await fetch(CHARS_ENDPOINT + data.user.id);
          const charData = await charResponse.json();
          setCharacters(charData.characterNames || []);
        } else {
          setUser(null); // If the user is not authenticated, set user to null
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST", // POST method for logging out
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUser(null); // Clear the user state
        setCharacterName(undefined); // Clear the character name
        window.location.href = "/"; // Redirect to homepage or login page
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }

  return (
    <div className="absolute top-0 right-0">
      <button
        ref={buttonRef}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg 
  border border-border bg-background/50 hover:bg-accent 
  transition-colors duration-200"
        title="Account management"
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4a90e2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span className="sr-only">Toggle theme</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown menu
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
        >
          <ul className="space-y-2 py-2">
            {!user ? (
              <li>
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                  onClick={() => {
                    window.location.href = "/auth/discord/callback"; // Redirect to Discord login if no user
                  }}
                >
                  Login with Discord
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
                {characters.map((character, index) => (
                  <li key={index}>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                      onClick={() => {
                        setCharacterName(character);
                        setIsOpen(false);
                      }}
                    >
                      {character}
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Account;

// TODO: Three lines, then login/logout/swtich char
