import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';
import ProfilePic from './profilepic';
import NameAndSurname from './name_and_surname';

function Newcomment(props){
    const [comment,setComment] = useState('')
    const [submit, setSubmit] = useState(false)
    
    const submitData = (e)=>{
        e.preventDefault()
        if (comment != ''){
            setSubmit(true)
        }else setSubmit(false)
    }

    useEffect(()=>{
        const sendData = async ()=>{
            await Axios.post('http://localhost:4000/api/posts/add_comment',{
                id:props.location.state.object.idsource,
                name:JSON.parse(localStorage.getItem("user")).name,
                surname:JSON.parse(localStorage.getItem("user")).surname,
                profileImage:JSON.parse(localStorage.getItem("user")).profileImage,
                email:JSON.parse(localStorage.getItem("user")).email,
                text:comment
            }, {withCredentials:true})
            .then(res=>{
                if(res.status == 200) console.log("yep")
            })
            .catch(e=>{
                if (e.status === 401)
                        localStorage.clear()
                console.log(e,props.location.state.object.idsource)
            })
        }
        if(submit)sendData()
    },[submit])
    return(
        <div className="container justify-content">
            <div className="row">
                <div className="col-md-12 my-2 ">
                    <div className="border border-dark rounded my-3">
                        <div className="media clearfix">
                            <ProfilePic basic_info={props.location.state.object}/>
                            <div className="media-body ">
                                <NameAndSurname basic_info={props.location.state.object}/>
                                    <p>{props.location.state.object.text}</p>                               
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <textarea type="textarea" className="form-control" id="comment" onChange={(e)=>setComment(e.target.value)}/>
                        </div>
                    </form>
                    <Link to="/">
                            <button type="submit" className="btn btn-primary" onClick={submitData}>submit</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Newcomment;