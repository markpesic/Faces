import React, { useState } from "react";
import { ChatLeftDots } from "react-bootstrap-icons";
import { ChatLeftDotsFill } from "react-bootstrap-icons";
import { Heart } from "react-bootstrap-icons";
import { HeartFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Post(props) {
	const [like, setLike] = useState(false);

	console.log("props:", props);

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

					{/* <h5 className="mt-0">Media with stretched link</h5> */}
					<p>{props.Obj.text}</p>
					<Link
						to={{
							pathname: "/comments",
							search: "?post=name",
							state: { object: props.Obj },
						}}
					>
						<ChatLeftDots className="mb-3 mr-3" />
					</Link>
					<Link
						to={{
							pathname: "/newcomment",
							search: "?comment=id",
							state: { object: props.Obj },
						}}
					>
						<ChatLeftDotsFill className="mb-3 mr-3" />
					</Link>
					<a
						href="#"
						onClick={() => setLike(!like)}
						className="float-right"
					>
						{like ? (
							<HeartFill className="mb-3 mr-3" />
						) : (
							<Heart className="mb-3 mr-3" />
						)}{" "}
					</a>
				</div>
			</div>
		</div>
	);
}

export default Post;
