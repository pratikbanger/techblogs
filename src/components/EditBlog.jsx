import React, { useEffect, useState } from 'react'
import './CSS/CreateBlog.css'
import { useNavigate, useParams } from 'react-router-dom'
import loadingSpinner from './loadingSpinner.gif'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileBase from 'react-file-base64';
import Login from './Login';

const EditBlog = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    let navigate = useNavigate();
    const [postData, setPostData] = useState({ title: '', summary: '', content: '', files: '' });
    const [loading, setLoading] = useState(false)

    const { id } = useParams();

    useEffect(() => {
        setLoading(true)
        fetch(`${backendLink}/api/blog/${id}`)
        .then(response => {
            response.json().then(blogData => {
                setPostData({ title: blogData.title, summary: blogData.summary, content: blogData.content, files: blogData.files })
                setLoading(false)
            });
        })
        // eslint-disable-next-line
    }, [])
    
    const handleUpdateBLOG = async (e) => {
        e.preventDefault();
        setLoading(true)
        await fetch(`${backendLink}/api/blog/updateblog/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ id: id, title: postData.title, summary: postData.summary, content: postData.content, files: postData.files })
        })
        setLoading(false)
        if (localStorage.getItem('techBlogAdmin') === 'true') {
            navigate('/');
        } else {
            navigate('/myblogs');
        }
    }

    return (
        <>
            {!localStorage.getItem('token')
                ? <Login />
                : <main>
                    {loading ?
                        <div className='container mt-5 d-flex justify-content-center' style={{ width: "120px", height: "120px" }}>
                            <img src={loadingSpinner} alt="loading..." />
                        </div>
                        :
                        <form className='mt-3' onSubmit={handleUpdateBLOG}>
                            <input type="title" placeholder='Blog title' className='createBlogInput' value={postData.title} onChange={e => setPostData({ ...postData, title: e.target.value })} required={true} />
                            <input type="summary" placeholder='Summary' className='createBlogInput' value={postData.summary} onChange={e => setPostData({ ...postData, summary: e.target.value })} required={true} />
                            <FileBase type="file" multiple={false} value={postData.files} onDone={({ base64 }) => setPostData({ ...postData, files: base64 })} />
                            <ReactQuill theme="snow" value={postData.content} onChange={newValue => setPostData({ ...postData, content: newValue })} required={true} />
                            <button disabled={postData.content === ''} className='btn btn-primary createBlogInput'>UPDATE BLOG</button>
                        </form>}
                </main>
            }
        </>
    )
}

export default EditBlog
