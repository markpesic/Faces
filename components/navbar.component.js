import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import {userContext} from './userContext';
import {Navbar} from 'react-bootstrap';

function Navbar1(props){
    const { dispatch } = React.useContext(userContext)

    return(
        <Navbar bg="light" expand="lg">
        <Navbar.Brand>The Lorem Ipsum</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <Link to="/newpost" className="my-2 my-lg-0"><button type="button" className="btn btn-info">New post</button></Link>
                </li>
                <li className="nav-item">
                    <Link to="/profile" className="nav-link mr-sm-2">Profile</Link>
                </li>
                <li className="nav-item">
                    <Link to="/friends" className="nav-link mr-sm-2">Friends</Link>
                </li>
                <li className="nav-item">
                   <button className="btn btn-info my-2 my-sm-0" onClick={()=>{dispatch({
                        type:"LOGOUT",
                        payload:null
                    })}}>Log Out</button>
                </li>
               
            </ul>
        </Navbar.Collapse>
    </Navbar>
        
    );
}

export default Navbar1;