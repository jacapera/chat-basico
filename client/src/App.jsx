import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client';
import Inicio from './components/Inicio/Inicio'
import Home from './components/Home/Home'
import NotFound from './components/NotFound/NotFound'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import NavBar from './components/NavBar/NavBar'
import { setUser } from './redux/usersSlice'
import style from './App.module.css'
const apiUrl = import.meta.env.VITE_URL_API;

const App = () => {

  const [socket, setSocket] = useState(null);

  const access = useSelector(state => state.users.access);
  const dispatch = useDispatch();
  const location = useLocation();
  const loggedUserJSON = window.localStorage.getItem('loggedChatUser')

  useEffect(() => {
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  //Conexión de Socket al servidor
  useEffect(() => {
    if(!socket){
      const newSocket = io(apiUrl);
      newSocket.on("connect", () => {
        setSocket(newSocket)});
      return () => {
        socket && newSocket.disconnect();
      };
    }
  },[socket]);


  return (
    <div className={`${style.container} `}>
      { !access && !loggedUserJSON ? <Login /> : <NavBar /> }
      <Routes>
        <Route path={'/inicio'} element={<Inicio />} />
        <Route path={'/home'} element={<Home />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/chat'} element={<Chat socket={socket} />} />
        <Route path={'/*'} element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App