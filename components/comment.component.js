import React, {useState, useEffect} from 'react'
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import Comment from './comment'
import ProfilePic from './profilepic';
import NameAndSurname from './name_and_surname';

function comments(props){
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
                                {/* <a href="#" onClick={()=>setLike(!like)}className="float-right">{like?<HeartFill className="mb-3 mr-3"/>:<Heart className="mb-3 mr-3" />} </a> */}
                                    {props.location.state.object.comments.map(comment=>{
                                        return <Comment Obj={comment}/>
                                    })}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default comments