import React, {useState, useEffect, useCallback} from 'react';
import Friend from './friend';
import SearchFriend from './searchfriend';
import Axios from 'axios';
import {Alert} from 'react-bootstrap';

function Friends(props){
    const [submit,setSubmit] = useState(false)
    const [name_surname,setName_surname] = useState('')
    const [successAlert,setSuccessAlert] = useState(false)
    const [error, setError] = useState(false)
    const [friendrequest, setFriendRequest] = useState([])
    const [searchResult, SetSearchResult] = useState(null)

    useEffect(()=>{
        const newFriendRequest = async ()=>{
            await Axios.post('http://localhost:4000/api/users/friend_request',{
                _id:JSON.parse(localStorage.getItem("user"))._id
            }, {withCredentials:true})
            .then(res=>{
                console.log(res)
                if(res.data !== {})
                    setFriendRequest(res.data)
                console.log(friendrequest)
            })
            .catch(e=>{
                if (e.status === 401)
                        localStorage.clear()
                console.log(e)
            })
        }

        newFriendRequest()
    },[])
    useEffect(()=>{
        const searchUser = async ()=>{
            await Axios.post('http://localhost:4000/api/users/get_users',{name_surname}, {withCredentials:true})
                .then(res=>{
                    console.log(res)
                    SetSearchResult(res.data)
                })
                .catch(e=>{
                    console.log(e)
                })
        }
        if (name_surname !== "")
            searchUser()
        else
            SetSearchResult([])
    },[name_surname])
    return(
        <div className="container">
            {successAlert?<Alert variant="success" onClose={() => setSuccessAlert(false)} dismissible>Friend request sent</Alert>:""}
            {error?<Alert variant="danger" onClose={() => setError(false)} dismissible>The email doesn't exist or an error occured</Alert>:""}
            <div className="row">
                <div className="col-sm-12 col-lg-6 my-3 mx-auto">
                    <form className="form-inline">
                        <input className="form-control mr-sm-2" type="search" placeholder="IlJack@prova.prova" aria-label="Search" onChange={(e)=>setName_surname(e.target.value)}/>
                        <button className="btn btn-outline-info my-2 my-sm-0" type="submit" onClick={(e)=>{
                            e.preventDefault()
                            setSubmit(!submit)
                        }}>Add Friend</button>
                    </form>
                </div>
            </div>
            <div className="row">
                {searchResult?searchResult.map(users=>{
                    if(users.profileImage !== JSON.parse(localStorage.getItem('user')).profileImage )
                        return <div className="col-md-12 my-2 "><SearchFriend Obj={users}/> </div>
                }):""}
            </div>
            <div className="row">
                    {friendrequest.map(posts=>{
                        if (posts.status === 'PENDING')
                            return <div className="col-md-12 my-2 "><Friend Obj={posts}/> </div>
                    })}
            
                    {friendrequest.map(posts=>{
                        if (posts.status === 'ACCEPTED')
                            return <div className="col-md-12 my-2 "><Friend Obj={posts}/> </div>
                    })}
                
            </div>
            
        </div>
    )
}

export default Friends;