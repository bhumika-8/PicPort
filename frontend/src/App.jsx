import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import authhook from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIelements/LoadingSpinner';

// ✅ Lazy-loaded routes
const Users = React.lazy(() => import('./user/pages/Users'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const NewPlaces = React.lazy(() => import('./places/pages/NewPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

function App() {
  const { token, login, logout, userId, isAuthReady } = authhook();

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ isLogged: !!token, token, userId, login, logout }}>
      <Router>
        <MainNavigation />
        <div className='page-content'>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/places/new" element={<NewPlaces />} />
              <Route path="/places/:placeId" element={<UpdatePlace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/:userId/places" element={<UserPlaces />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
