import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

function Newcomment(props) {
	const [comment, setComment] = useState("");
	const [submit, setSubmit] = useState(false);

	const submitData = (e) => {
		e.preventDefault();
		if (comment != "") {
			setSubmit(true);
		} else setSubmit(false);
	};

	useEffect(() => {
		const sendData = async () => {
			console.log(props.location.state.object);
			await Axios.post(
				"http://localhost:4000/api/posts/add_comment",
				{
					id:
						props.location.state.object._id ||
						props.location.state.object.idsource,
					name: JSON.parse(localStorage.getItem("user")).name,
					surname: JSON.parse(localStorage.getItem("user")).surname,
					profileImage: JSON.parse(localStorage.getItem("user"))
						.profileImage,
					email: JSON.parse(localStorage.getItem("user")).email,
					text: comment,
				},
				{ withCredentials: true }
			)
				.then((res) => {
					if (res.status == 200) console.log("yep");
				})
				.catch((e) => {
					console.log(e, props.location.state.object.idsource);
				});
		};
		if (submit) sendData();
	}, [submit]);
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
							</div>
						</div>
					</div>
					<form>
						<div className="form-group">
							<label htmlFor="comment">Comment</label>
							<textarea
								type="textarea"
								className="form-control"
								id="comment"
								onChange={(e) => setComment(e.target.value)}
							/>
						</div>
					</form>
					<Link to="/">
						<button
							type="submit"
							className="btn btn-primary"
							onClick={(e) => {
								submitData(e);
								window.history.back();
							}}
						>
							submit
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Newcomment;
