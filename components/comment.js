import React, {useState} from 'react';
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import ProfilePic from './profilepic';
import NameAndSurname from './name_and_surname';

function comment(props){
    return(
        <div className="border border-dark rounded my-3">
            <div className="media clearfix">
                <ProfilePic basic_info={props.Obj}/>
                <div className="media-body ">
                    <NameAndSurname basic_info={props.Obj}/>
                        <p>{props.Obj.text}</p>
                    {/* <a href="#" onClick={()=>setLike(!like)}className="float-right">{like?<HeartFill className="mb-3 mr-3"/>:<Heart className="mb-3 mr-3" />} </a> */}
                </div>
            </div>
        </div>
    )
}

export default comment