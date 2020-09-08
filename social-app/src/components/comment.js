import React, { useState } from "react";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";

function comment(props) {
	return (
		<div className="border border-dark rounded my-3">
			<div className="media clearfix">
				<img
					src={props.Obj.profileImage}
					className="rounded-circle mx-3 mb-3 mt-1 float-left img-post"
					alt="..."
				/>
				<div className="media-body ">
					<p>
						{props.Obj.name} {props.Obj.surname}
					</p>
					<p>{props.Obj.text}</p>
					{/* <a href="#" onClick={()=>setLike(!like)}className="float-right">{like?<HeartFill className="mb-3 mr-3"/>:<Heart className="mb-3 mr-3" />} </a> */}
				</div>
			</div>
		</div>
	);
}

export default comment;
