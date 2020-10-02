import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import {userContext} from './userContext';

function Login(){
    const { dispatch } = React.useContext(userContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submit, setsubmit] = useState(false)
    const [success, setSuccess] = useState(false)
    const [status, setStatus] = useState(true)

    const sendData = async()=>{
        await Axios.post('http://localhost:4000/api/users/log_in', {
            email:email,
            password:password
        }, {withCredentials:true})
        .then((res)=>{
            if (res.status === 200){
                console.log(res)
                setsubmit(true)
                dispatch({
                    type:"LOGIN",
                    payload: res.data
                })
            }
        })
        .catch((e)=>{
            console.log(e)
            setsubmit(false)
        })
    }

    const submitData = (e)=>{
        e.preventDefault()
        setStatus(false)
    }

    useEffect(()=>{
        console.log(email,password)
        if((email !== '') && (password !== ''))setSuccess(true)
        else setSuccess(false)
        if (success === true){
            sendData()
            console.log("works")
        }
    },[email, password, success])

    return(
        <div className="container ">
            <div className="row  align-items-center min-vh-100">
                <div className="col-lg-5  col-md-8 col-sm-12 mx-auto  ">
                    <form className="form-login">
                        <div className="form-group ">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onBlur={(e)=>setEmail(e.target.value)}/>                  
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" onBlur={(e)=>setPassword(e.target.value)}/>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                            <label className="form-check-label" htmlFor="exampleCheck1">rememeber me</label>
                        </div>
                        <div className="form-group">
                            <Link to="/register">Register</Link>
                        </div>
                        {submit?
                        <Link to="/">
                            <button type="submit" className="btn btn-primary" >Log in</button>
                        </Link>
                        :
                        <button type="submit" className="btn btn-primary" onClick={(e)=>submitData(e)}>Log in</button>
                        }
                        {status?"":<p>Username or Password are Wrong</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;