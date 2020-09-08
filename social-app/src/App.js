import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { userContext } from "./components/userContext";

import Navbar1 from "./components/navbar.component.js";
import Posts from "./components/posts.component.js";
import Footer from "./components/footer.component.js";
import Newpost from "./components/newpost.component.js";
import Login from "./components/login.component.js";
import Register from "./components/register.component.js";
import Profile from "./components/profile.component.js";
import Comments from "./components/comment.component.js";
import NewComments from "./components/newcomments.component.js";
import Friends from "./components/friends.component.js";

const initialState = {
	isLoggedIn: false,
	token: null,
	userData: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			localStorage.setItem("user", JSON.stringify(action.payload));
			localStorage.setItem("token", JSON.stringify(action.payload._id));
			return {
				...state,
				isLoggedIn: true,
				token: action.payload._id,
				userData: action.payload,
			};

		case "LOGOUT":
			localStorage.clear();
			return {
				...state,
				isLoggedIn: false,
				token: null,
				userData: null,
			};
		default:
			return state;
	}
};

function App() {
	const [state, dispatch] = React.useReducer(reducer, initialState);

	return (
		<userContext.Provider
			value={{
				state,
				dispatch,
			}}
		>
			<Router>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				{localStorage.getItem("token") ? (
					<Switch>
						<Route path="/" exact>
							<Navbar1 />
							<Posts />
						</Route>
						<Route path="/newpost" component={Newpost} />
						<Route path="/comments" component={Comments} />
						<Route path="/profile" component={Profile} />
						<Route path="/newcomment" component={NewComments} />
						<Route path="/friends" component={Friends} />
					</Switch>
				) : (
					<Redirect to="/login" />
				)}
			</Router>
		</userContext.Provider>
	);
}

export default App;
