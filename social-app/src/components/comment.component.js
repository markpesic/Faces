import React, { useState, useEffect } from "react";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";
import Comment from "./comment";
import { Link } from "react-router-dom";

function comments(props) {
	return (
		<div className="container justify-content">
			<a href="javascript:history.back();">Go Back</a>
			<div className="row">
				<div className="col-md-12 my-2 ">
					<div className="border border-dark rounded my-3">
						<div className="media clearfix">
							<img
								src={props.location.state.object.profileImage}
								className="rounded-circle mx-3 mb-3 mt-1 float-left img-post"
								alt="..."
							/>
							<div className="media-body ">
								<p>
									{props.location.state.object.name}{" "}
									{props.location.state.object.surname}
								</p>
								<p>{props.location.state.object.text}</p>
								{/* <a href="#" onClick={()=>setLike(!like)}className="float-right">{like?<HeartFill className="mb-3 mr-3"/>:<Heart className="mb-3 mr-3" />} </a> */}
								{props.location.state.object.comments.map(
									(comment) => {
										return <Comment Obj={comment} />;
									}
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default comments;
