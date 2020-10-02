import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
function ProfilePic(props){
    const [pathname,setPathname] = useState('/profilefriends')
    const [search, setSearch] = useState("?name="+props.basic_info.name+"?surname="+props.basic_info.surname)

   useEffect(()=>{
        if(JSON.parse(localStorage.getItem('user')).profileImage === props.basic_info.profileImage){
            setPathname("/profile")
            setSearch("")
        }
   },[])
   
    return(
        <Link to={{
            pathname:pathname,
            search:search,
            state:{object:props.basic_info}
        }}>
            <img src={props.basic_info.profileImage}  className="rounded-circle mx-3 mb-3 mt-1 float-left img-post" alt="..."/>
        </Link>
    )
}

export default ProfilePic;