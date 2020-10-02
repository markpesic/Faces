import React, {useState, useEffect} from 'react'
import Post from './post'
import Axios from 'axios'


function Posts(){
    const [post, setPost] = useState([])

    return(
        <div className="container justify-content">
            <div className="row">
                    {post.map(posts=>{
                        return <div className="col-md-12 my-2 "><Post Obj={posts}/> </div>
                    })}
                
            </div>
        </div>
    )
}

export default Posts;