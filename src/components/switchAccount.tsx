"use client";

import React, { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState<any>(null); // Store the user object
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    // Fetch the user data from the /api/user route
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();

        // If the user is authenticated, store the user data in state
        if (data.user) {
          setUser(data.user);
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

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user data
  }

  // TODO: Discord login here
  // if (!user) {
  //   return <div>Please log in to switch accounts.</div>; // Prompt to log in if no user is found
  // }

  return (
    <div className="absolute top-0 right-0">
      <button
        className="relative inline-flex h-10 w-30 items-center justify-center rounded-lg 
        border border-border bg-background/50 hover:bg-accent 
        transition-colors duration-200 flex items-center gap-2 p-4"
        onClick={() => {
          if (!user) {
            window.location.href = "/auth/discord/callback"; // Redirect to Discord login if no user
          }
        }}
      >
        {user ? (
          <div>Welcome, {user.username}!</div> // Show username if user exists
        ) : (
          <div>Login with Discord</div> // Show login button if no user
        )}
      </button>
    </div>
  );
};

export default Login;
