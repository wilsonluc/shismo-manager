'use client';

import React from "react";

const Login = () => {
  return (
    <div className="absolute top-0 right-0">
      <button
        className="relative inline-flex h-10 w-30 items-center justify-center rounded-lg 
        border border-border bg-background/50 hover:bg-accent 
        transition-colors duration-200"
        title="Current theme: dark"
        onClick={() => window.location.href = '/api/auth/discord'}
      >
        Login with Discord
      </button>
    </div>
  );
};

export default Login;
