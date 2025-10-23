import React, { useEffect } from "react";

export const AuthContext = React.createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const value = React.useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    // Define the async function inside the useEffect
    const fetchUser = async () => {
      try {
        const res = await api("/api/me");
        setUser(res.user);
      } catch (error) {
        console.error("Error fetching user:", error); // Optional: log the error
      }
    };

    fetchUser(); // Call the async function
  }, []); // Empty dependency array means it runs once on mount

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
