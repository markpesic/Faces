import React, { useState, useEffect } from "react";
import Axios from "axios";
function Friend(props) {
	const [accept, setAccept] = useState(false);
	const [refuse, setRefuse] = useState(false);

	useEffect(() => {
		const sendData = async () => {
			let request_friend = {
				email_end_user: JSON.parse(localStorage.getItem("user")).email,
				email_request_user: props.obj.email,
				name_end_user: JSON.parse(localStorage.getItem("user")).name,
				surname_end_user: JSON.parse(localStorage.getItem("user"))
					.surname,
				name_request_user: props.obj.name,
				surname_request_user: props.obj.surname,
				profileImage_request_user: props.obj.profileImage,
				profileImage_end_user: JSON.parse(localStorage.getItem("user"))
					.profileImage,
				status: null,
			};
			if (accept === true) request_friend.status = "ACCEPTED";
			else request_friend.status = "REFUSED";
			await Axios.post(
				"http://localhost:4000/api/users/resolve_friend_request",
				request_friend,
				{ withCredentials: true }
			)
				.then((res) => {
					console.log(res);
					setAccept(false);
					setRefuse(false);
				})
				.catch((e) => {
					console.log(e);
					setAccept(false);
					setRefuse(false);
				});
		};

		if (accept || refuse) {
			sendData();
		}
	}, [accept, refuse]);
	return (
		<div className="border border-dark rounded my-3">
			<div className="media">
				<img
					src={props.obj.profileImage}
					className="rounded-circle mx-3 mb-3 mt-1 float-left img-post mr-3"
					alt="..."
				/>
				<div className="media-body ">
					{props.obj.name} {props.obj.surname}
					{props.obj.status === "PENDING" ? (
						<div className="button-group">
							<button
								className="btn btn-primary mx-3 mb-3"
								onClick={(e) => setAccept(true)}
							>
								Accept
							</button>
							<button
								className="btn btn-primary mx-3 mb-3"
								onClick={(e) => setRefuse(true)}
							>
								Refuse
							</button>
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	);
}

export default Friend;
