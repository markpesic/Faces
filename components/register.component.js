import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import FileBase64 from 'react-file-base64';
//TODO:
//-optionally add some more secure password 

function Register(){
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [validEmail,setValidEmail] = useState(true)
    const [surname,setNameAndSurname] = useState('')
    const [password,setPassword] = useState('')
    const [image, setImage] = useState(null)
    const [agreed,setAgreed] = useState(false)
    const [submit,setSubmiit] = useState(false)
    const [password_match, setPassword_match] = useState(null)

    const  control_password =(e)=>{
        if (e.target.value.length < 8){
            e.target.value = ''
        }
        setPassword(e.target.value)
    }

    const   validateEmail =(e)=>{
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailre = re.test(String(e.target.value).toLowerCase());
        if (emailre === false){
            setEmail('')
            e.target.value = ''
        }else{
            setEmail(e.target.value)
        }
        
    }

    const submitData = (e)=>{
       
        if (submit===false){
            e.preventDefault()
        }
    }

    const fetchData = async ()=>{
        console.log(image)
        const formData = new FormData()
        formData.append('profileImg', image)
        formData.append('name', name)
        formData.append('surname', surname)
        formData.append('email',email)
        formData.append('password',password)
        console.log(formData.entries()[0])
        await axios({
            method:'post',
            url:'http://localhost:4000/api/users/create',
            data:formData,
            headers: {'Content-Type': 'multipart/form-data' }}
        )
        .then((res)=>{
            //if (res.status === "utente già esistente"){setValidEmail(false)}
            console.log(res)
        })
        .catch((e)=>console.log(e))
    }

    useEffect(()=>{

        if (submit === true){
            fetchData()
        }

        if ((name !== '' ) && (password !== '') && (agreed === true) && (email !== '') && (password_match === true)){
            setSubmiit(true)
        }
    })

    return(  
        <div className="container ">
            <div className="row  align-items-center min-vh-100">
                <div className="col-lg-5  col-md-8 col-sm-12 mx-auto  ">
                    <form className="form-login">
                        <div className="form-group ">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" onBlur={(e)=> validateEmail(e)}/>
                            {email !== ''?"Email is valid":"Invalid email Inserted"}
                            {validEmail === true?"":"already existing email inserted"}
                        </div>
                        <div className="form-group ">
                            <label htmlFor="Username">Name</label>
                            <input  type="text" className="form-control" id="Username" onBlur={(e)=> setName(e.target.value)}/>                  
                        </div>
                        <div className="form-group ">
                            <label htmlFor="name_and_username">Surname</label>
                            <input  type="text" className="form-control" id="name_and_username" onBlur={(e)=> setNameAndSurname(e.target.value)}/>                  
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputPassword">Password</label>
                            <input  type="password" className="form-control" id="InputPassword" onBlur={(e)=>control_password(e)}/>
                            {password === ''?<p style={{color:'red',}}>*Password minimum 8 characters</p>:''}
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputPassword"> Repeat Password</label>
                            <input type="password" className="form-control" id="InputPassword" onBlur={(e)=>e.target.value===password?setPassword_match(true):setPassword_match(false)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Image"> Image</label>
                            <input type="file" id="Image" name ='profileImg' onChange={e=>setImage(e.target.files[0])} />
                            
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={()=>setAgreed(!agreed)} required/>
                            <label className="form-check-label" htmlFor="exampleCheck1">Agree to term and services</label>
                        </div>
                        {submit?<Link to="/login"><button  className="btn btn-primary" onClick={(e)=>submitData(e)}>Register</button></Link>:<button type="submit" className="btn btn-primary" onClick={(e)=>submitData(e)}>Register</button>}
                        {submit?console.log("true"):console.log("false")}
                    </form>
                </div>
            </div>
        </div>
        )
}

export default Register;