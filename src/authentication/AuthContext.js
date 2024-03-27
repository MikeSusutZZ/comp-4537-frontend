import React, { createContext, useState } from 'react'

/* Creates a Context object. This allows ANY child component
to access the data it holds -- in this case, user authentication
status. It also provides methods to change that status. */
const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
function AuthProvider ({ children }) {
  /* This keeps track of the current user's authentication status
  The initial, default value is null, meaning no user is logged in. */
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
