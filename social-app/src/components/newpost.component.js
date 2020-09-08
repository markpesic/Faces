import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

function Newpost() {
	const [post, setPost] = useState("");
	const [submit, setSubmit] = useState(false);

	const setData = (e) => {
		setPost(e.target.value);
	};

	const sendSubmit = (e) => {
		e.preventDefault();
		setSubmit(true);
	};

	useEffect(() => {
		const sendData = async () => {
			await Axios.post(
				"http://localhost:4000/api/posts/create",
				{
					email: JSON.parse(localStorage.getItem("user")).email,
					name: JSON.parse(localStorage.getItem("user")).name,
					surname: JSON.parse(localStorage.getItem("user")).surname,
					profileImage: JSON.parse(localStorage.getItem("user"))
						.profileImage,
					text: post,
				},
				{ withCredentials: true }
			)
				.then((res) => {
					console.log(JSON.parse(localStorage.getItem("user")).email);
					if (res.status === 200) console.log("it works post");
					if (res.status === 401) console.log("Auth problem");
				})
				.catch((e) => {
					console.log(e);
					setSubmit(false);
				});
		};
		if (submit === true) sendData();
	}, [submit]);

	return (
		<div className="container">
			<Link to="/">Home</Link>
			<form>
				<div className="form-group">
					<label for="comment">Write your post</label>
					<textarea
						className="form-control"
						id="comment"
						rows="3"
						onChange={setData}
					></textarea>
				</div>
			</form>
			<Link to="/">
				<button
					type="submit"
					class="btn btn-primary mb-2"
					onClick={sendSubmit}
				>
					Post
				</button>
			</Link>
		</div>
	);
}

export default Newpost;
