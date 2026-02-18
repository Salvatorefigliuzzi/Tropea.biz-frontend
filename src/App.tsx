import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/store';
import { fetchProfile } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

//TODO cambiare gli useeffect in  usefocus effect
//TODO Gestione degli errore attraverso modal nell assegnamento di ruoli o permessi
//TODO sistemare i seder per assegnare anche il ruolo di User al gestore e forse all admin
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
