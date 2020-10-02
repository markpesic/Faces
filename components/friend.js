import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import ProfilePic from './profilepic'
import NameAndSurname from './name_and_surname'
function Friend(props){
    const [accept,setAccept] = useState(false)
    const [refuse, setRefuse] = useState(false)

    useEffect(()=>{
        const sendData = async ()=>{
            let request_friend = {
                _id_end_user:JSON.parse(localStorage.getItem('user'))._id,
                _id_request_user:props.Obj.friend_id,
                status:null
            }
            if (accept === true)
                request_friend.status = 'ACCEPTED'
            else
                request_friend.status = 'REFUSED' 
            await Axios.post('http://localhost:4000/api/users/resolve_friend_request',request_friend, {withCredentials:true})
                .then(res=>{
                    console.log(res)
                    setAccept(false)
                    setRefuse(false)
                })
                .catch(e=>{
                    console.log(e)
                    setAccept(false)
                    setRefuse(false)
                })
        }

        if (accept || refuse){
            sendData()
        }
    },[accept,refuse])
    return(
        <div className="border border-dark rounded my-3">
            <div className="media">
                <ProfilePic basic_info={props.Obj}/>
                <div className="media-body ">
                <NameAndSurname basic_info={props.Obj}/>
                {props.Obj.status === 'PENDING'?
                    <div className="button-group">
                    
                        <button className="btn btn-primary mx-3 mb-3" onClick={(e)=>setAccept(true)}>Accept</button>
                        <button className="btn btn-primary mx-3 mb-3" onClick={e=>setRefuse(true)}>Refuse</button>
                    
                    </div>
                    :""}
                </div>
            </div>
        </div>
    )
}

export default Friend;