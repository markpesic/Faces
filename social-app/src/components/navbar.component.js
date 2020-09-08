import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "./userContext";
import { Navbar } from "react-bootstrap";
import Axios from "axios";

function Navbar1(props) {
	const { dispatch } = React.useContext(userContext);

	const [newpost, setNewpost] = useState(0);
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
		if (submit === true) {
			document.querySelector("textarea").value = "";
			sendData();
		}
	}, [submit]);

	useEffect(() => {
		document.querySelector(".form-newpost").classList.toggle("open");
		console.log("open");
	}, [newpost]);

	return (
		<>
			<Navbar bg="light" expand="lg">
				<Navbar.Brand>Faces</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<ul className="navbar-nav fw">
						<li className="nav-item active">
							<p className="my-2 my-lg-0">
								<button
									id="newpost"
									type="button"
									className="btn btn-info"
									onClick={() => {
										setNewpost(newpost + 1);
									}}
								>
									New post
								</button>
							</p>
						</li>

						<li className="nav-item">
							<Link to="/friends" className="nav-link mr-sm-2">
								Friends
							</Link>
						</li>
						<li className="nav-item">
							<Link
								className="nav-link mr-sm-2"
								onClick={() => {
									dispatch({
										type: "LOGOUT",
										payload: null,
									});
								}}
							>
								Log Out
							</Link>
						</li>
						<li className="nav-item" id="nav-item-left">
							<Link to="/profile" className="nav-link mr-sm-2">
								Profile
							</Link>
						</li>
						<li>
							<Link to="/profile">
								<img
									src={
										JSON.parse(localStorage.getItem("user"))
											.profileImage
									}
									className="rounded-circle img-nav"
								/>
							</Link>
						</li>
					</ul>
				</Navbar.Collapse>
			</Navbar>
			<div className="form-newpost open">
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
						onClick={(e) => {
							sendSubmit(e);
							setNewpost(newpost + 1);
						}}
					>
						Post
					</button>
				</Link>
			</div>
		</>
	);
}

export default Navbar1;
