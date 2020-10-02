import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
function NameAndSurname(props){
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
            <p>{props.basic_info.name} {props.basic_info.surname}</p>
        </Link>
    )
}

export default NameAndSurname;