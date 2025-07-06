import React ,{useState,useCallback} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import NewPlaces from './places/pages/NewPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

function App() {
  const [isLogged,setIsLogged]=useState(false);
  const [userId,setUserId]=useState(null);
  
  const login=useCallback((uid)=>{
    setIsLogged(true);
    setUserId(uid)
  },[]);

    const logout=useCallback(()=>{
    setIsLogged(false);
    setUserId(null)
  },[]);

  return (
   <AuthContext.Provider value={{ isLogged, userId, login, logout }}>

    <Router>
      <MainNavigation />
      <div className='page-content'>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/places/new" element={<NewPlaces />} />
          <Route path="/places/:placeId" element={<UpdatePlace />} />
          <Route path="/auth" element={<Auth />}/>
          <Route path="/:userId/places" element={<UserPlaces />} />
        </Routes>
     </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
