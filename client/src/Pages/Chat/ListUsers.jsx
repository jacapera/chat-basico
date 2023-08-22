import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedUser, setError, setSelectedUser } from '../../redux/appSlice';
import { Link } from 'react-router-dom';
import { selectAllUsers, setAllUsers } from '../../redux/usersSlice';
const apiUrl = import.meta.env.VITE_URL_API;

const ListUsers = ({ messages }) => {

  const [usersFiltered, setUsersFiltered] = useState([]);
  const [userFind, setUserFind] = useState("");

  // Estados Globales
  // -------------------
  const allUsers = useSelector(selectAllUsers);
  const token = useSelector(state => state.users.token);
  const user = useSelector(state => state.users);
  const selectedUser = useSelector(selectSelectedUser)
  const dispatch = useDispatch();

  const handleChange = event => {
    const { value } = event.target;
    setUserFind(value);
  };

    // Seleccionar un usuario
    const handleUserSelection = (user) => {
      dispatch(setSelectedUser(user));
      setUsersFiltered([])
      setUserFind("")
      console.log('selectedUser: ',selectedUser);
    };

  const filterUsers = (allUsers, userFind) => {
    return allUsers?.filter(item => item.userName.toLowerCase().includes(userFind.toLowerCase()))
  }

  useEffect(() => {
    if(userFind !== ""){
      setUsersFiltered(filterUsers(allUsers, userFind));
    } else{
      setUsersFiltered([]);
    }
  }, [allUsers, userFind])

  useEffect(() => {
    if(user.access){
      axios.get(`${apiUrl}/api/v1/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })
        .then(({data}) => {
          //console.log('allUsers: ', data)
          const users = data.filter(item => item.user_id !== user.user_id)
          dispatch(setAllUsers(users));
          dispatch(setError(""));
        }).catch(error => {
          dispatch(setError(error.response.data.response))
        })
    }
  },[user.access])

  return (
    <div className='flex flex-col w-[100%] h-[auto] mt-[50px] '>
      <div className='flex p-[8px] border-2 mt-[10px] '>
        <input type='text' value={userFind} onChange={handleChange}
          className='border-2 rounded-md w-[100%] '
        />
      </div>
      <div>
        {
          usersFiltered.map((item) => (
            <div key={item.user_id} className='flex items-center gap-[10px] p-[8px] cursor-pointer'
              onClick={()=>handleUserSelection(item)}
            >
              <div>
                <img src={`${apiUrl}/${item.image}`} alt="foto de perfil"
                  className='w-[50px] h-[50px] object-cover rounded-full'
                />
              </div>
              <span >{item.userName}</span>
            </div>
          ))
        }
      </div>
      {/* {
        allUsers?.map((user) => (
          <div
            key={user.user_id}
            // onClick={() => onUserSelect(user) }
            className='flex h-[50px] items-center gap-[5px] cursor-pointer'
          >
            <div className='flex w-7 h-7 ml-[5px] rounded-full bg-gray-500'>
              <Link>
                <img className='w-full h-full object-cover rounded-full' src={`${apiUrl}/${user.image}`} alt='imagen de perfil' />
              </Link>
            </div>
            <h2
              className=" text-black"
              key={user.user_id}>{user.userName}
            </h2>
          </div>
        ))
      } */}
    </div>
  )
}

export default ListUsers