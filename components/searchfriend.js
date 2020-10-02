import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import ProfilePic from './profilepic'
import NameAndSurname from './name_and_surname'
function SearchFriend(props){
    const [search, setSearch] = useState(false)
    const [friend, setFriend] = useState(false)

    useEffect(()=>{
        const sendFriendRequest = async ()=>{
            await Axios.post('http://localhost:4000/api/users/create_friend_request',{
                idx:props.Obj._id,
                email_request_user:(JSON.parse(localStorage.getItem("user")).email)
            }, {withCredentials:true})
            .then(res=>{
                if (res.status === 200) {
                    console.log("Friend request sent")
                    console.log(res)
                }
            })
            .catch(e=>{
                if (e.status === 401)
                        localStorage.clear()
                console.log(e,"An error occured try again")
            })
        }
        if (search === true){
            sendFriendRequest()
            setFriend(true)
        }
    },[search])

    return(
        <div className="border border-dark rounded my-3">
            <div className="media">
                <ProfilePic basic_info={props.Obj}/>
                <div className="media-body ">
                <NameAndSurname basic_info={props.Obj}/>
                {friend?"":
                    <div className="button-group">
                        <button className="btn btn-primary mx-3 mb-3" onClick={(e)=>setSearch(true)}>Send Friend Request</button>
                    </div>}  
                </div>
            </div>
        </div>
    )
}

export default SearchFriend;