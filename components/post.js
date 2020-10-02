import React, {useState, useEffect} from 'react';
import { ChatLeftDots } from 'react-bootstrap-icons';
import { ChatLeftDotsFill } from 'react-bootstrap-icons'
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import ProfilePic from './profilepic';
import NameAndSurname from './name_and_surname';
import Axios from 'axios'

function Post(props){
    const [like, setLike] = useState(false);
    const [Everclicked, setEverclicked] = useState(false)

    useEffect(()=>{
        const sendlike = async () =>{
            await Axios.post('http://localhost:4000/api/posts/like', {
                idx:JSON.parse(localStorage.getItem('user'))._id,
                id_post: props.Obj.idsource,
                like:like
        }, {withCredentials: true})
        .then(res=>{
            console.log(res)
        })
        .catch(e=>{
            console.log(e)
        })
        }
        if(Everclicked === true)
            sendlike()
    }, [like])

    useEffect(()=>{
        const likes= async () =>{
            await Axios.post('http://localhost:4000/api/users/like',{idx:JSON.parse(localStorage.getItem('user'))._id},{withCredentials:true})
                .then(res=>{
                    console.log(res)
                    res.data.forEach(idx => {
                        if(idx === props.Obj.idsource)
                            setLike(true)
                    });
                })
                .catch(e=>{
                    console.log(e)
                })
        }
        likes()
    },[])
    return(
    <div className="border border-dark rounded my-3">
        <div className="media clearfix">
            <ProfilePic basic_info={props.Obj}/>
            <div className="media-body ">
                <NameAndSurname basic_info={props.Obj}/>
                    <p>{props.Obj.text}</p>
                <Link to={{
                    pathname:"/comments",
                    search:"?post=name",
                    state:{object:props.Obj}
                }}><ChatLeftDots className="mb-3 mr-3"/></Link>
                <Link to={{
                    pathname:"/newcomment",
                    search:"?comment=id",
                    state:{object:props.Obj}
                }}><ChatLeftDotsFill className="mb-3 mr-3"/></Link>
                <a href="#" onClick={()=>setLike(!like)}className="float-right">{like?<HeartFill onClick={()=>setEverclicked(true)} className="mb-3 mr-3"/>:<Heart className="mb-3 mr-3" onClick={()=>setEverclicked(true)}/>} </a>
            </div>
        </div>
    </div>
    )
}

export default Post;