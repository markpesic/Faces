import React, { useState, useEffect, useCallback } from "react";
import Friend from "./friend";
import { SomePosts } from "../data";
import Axios from "axios";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const initialState = {
	pending: false,
	accepted: false,
	refused: false,
};

// const reducer = (state, action)=>{
//     switch(action.type){
//         case 'PENDING':
//             return{
//                 ...state,
//                 pending:true,
//                 accepted:false,
//                 refused:false,

//         };
//         case 'ACCEPTED':
//             return{
//                 ...state,
//                 pending:false,
//                 accepted:true,
//                 refused:false,
//             };
//         case 'REFUSED':
//             return{
//                 ...state,
//                 pending:false,
//                 accepted:false,
//                 refused:true,
//             };
//         default:
//             return state;
//     }
// }

function Friends(props) {
	const [submit, setSubmit] = useState(false);
	const [email, setEmail] = useState("");
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);
	const [friendrequest, setFriendRequest] = useState([]);

	// const [state, dispatch] = React.useReducer(reducer, initialState);

	useEffect(() => {
		const newFriendRequest = async () => {
			await Axios.post(
				"http://localhost:4000/api/users/friend_request",
				{
					email: JSON.parse(localStorage.getItem("user")).email,
				},
				{ withCredentials: true }
			)
				.then((res) => {
					console.log(res);
					setFriendRequest(res.data);
					console.log(friendrequest);
				})
				.catch((e) => {
					console.log(e);
				});
		};

		newFriendRequest();
	}, []);

	useEffect(() => {
		const sendFriendRequest = async () => {
			await Axios.post(
				"http://localhost:4000/api/users/create_friend_request",
				{
					email: email,
					email_request_user: JSON.parse(localStorage.getItem("user"))
						.email,
				},
				{ withCredentials: true }
			)
				.then((res) => {
					if (res.status === 200) {
						console.log("Friend request sent");
						console.log(res);
					}
					setSuccessAlert(true);
				})
				.catch((e) => {
					console.log(e, "An error occured try again");
					setError(true);
				});
		};
		if (email !== "") {
			sendFriendRequest();
		}
	}, [submit]);
	return (
		<div className="container">
			<Link to="/">Home</Link>

			{successAlert ? (
				<Alert
					variant="success"
					onClose={() => setSuccessAlert(false)}
					dismissible
				>
					Friend request sent
				</Alert>
			) : (
				""
			)}
			{error ? (
				<Alert
					variant="danger"
					onClose={() => setError(false)}
					dismissible
				>
					The email doesn't exist or an error occured
				</Alert>
			) : (
				""
			)}
			<div className="row">
				<div className="col-sm-12 col-lg-6 my-3 mx-auto">
					<form className="form-inline">
						<input
							className="form-control mr-sm-2"
							type="search"
							placeholder="IlJack@prova.prova"
							aria-label="Search"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button
							className="btn btn-outline-info my-2 my-sm-0"
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								setSubmit(!submit);
							}}
						>
							Add Friend
						</button>
					</form>
				</div>
			</div>
			<div className="row">
				{friendrequest.map((posts) => {
					if (posts.status === "PENDING")
						return (
							<div className="col-md-12 my-2 ">
								<Friend obj={posts} />{" "}
							</div>
						);
				})}

				{friendrequest.map((posts) => {
					if (posts.status === "ACCEPTED")
						return (
							<div className="col-md-12 my-2 ">
								<Friend obj={posts} />{" "}
							</div>
						);
				})}
			</div>
		</div>
	);
}

export default Friends;
