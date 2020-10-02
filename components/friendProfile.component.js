import React, {useState, useEffect} from 'react';
import Post from './post'
import {SomePosts} from '../data'
import { Link } from 'react-router-dom';
import Axios from 'axios';

function FriendProfile(props){

    const [post] = useState(SomePosts)
    const [profileImg, setProfileImg] = useState('')
    const [realposts, setRealPosts] = useState([])

    useEffect(()=>{
        const FetchData = async ()=>{
            const data = await Axios.post('http://localhost:4000/api/users/get_posts/',{
        email:props.location.state.object.email
    }, {withCredentials:true})
        .then((res)=>{
            console.log(res)
            setRealPosts(res.data)
        })
        .catch((e)=>{
            if (e.status === 401)
                        localStorage.clear()
            console.log(e)
        })
        }
        FetchData()
    },[])

    return(
        <div >
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div className="clearfix">
    <h5><a class="navbar-brand" href="#">{props.location.state.object.name} {props.location.state.object.surname}</a></h5>
                    
                </div>
                <img src={props.location.state.object.profileImage} className="rounded-circle mx-auto d-block img-profile"/>
            </nav>
            { <div className="container">
                <div className="row">
                        {realposts.map(posts=>{
                            return <div className="col-md-12 my-2 "><Post Obj={posts}/> </div>
                        })}
                    
                </div>
            </div> }
        </div>
    )
}

export default FriendProfile;