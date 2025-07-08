import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import NewPlaces from './places/pages/NewPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import authhook from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIelements/LoadingSpinner';
function App() {
  const { token, login, logout, userId, isAuthReady } = authhook();

if (!isAuthReady) {
  <LoadingSpinner />
}

  return (
    <AuthContext.Provider value={{ isLogged: !!token, token: token, userId, login, logout }}>

      <Router>
        <MainNavigation />
        <div className='page-content'>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/places/new" element={<NewPlaces />} />
            <Route path="/places/:placeId" element={<UpdatePlace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
