"use client";
import React from "react";
import { useAuth } from "../context/auth-provider";
import { useTheme } from "../context/theme-provider";

const Page: React.FC = () => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <div>
      {user ? (
        <>
          <p className="text-center">Welcome, {user.email}!</p>
        </>
      ) : (
        <div>
          <p className="text-lg">Hey, you are not logged in!</p>
          {dark ? <p>The theme is dark!</p> : <p>The theme is not dark!</p>}
          <button onClick={toggleTheme}> Change theme!</button>
        </div>
      )}
    </div>
  );
};

export default Page;
