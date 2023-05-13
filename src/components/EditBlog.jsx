import React, { useEffect, useState } from 'react'
import './CSS/CreateBlog.css'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileBase from 'react-file-base64';
import Login from './Login';

const EditBlog = () => {


    let navigate = useNavigate();
    const [postData, setPostData] = useState({ title: '', summary: '', content: '', files: '' });

    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:5000/api/blog/${id}`)
            .then(response => {
                response.json().then(blogData => {
                    setPostData({ title: blogData.title, summary: blogData.summary, content: blogData.content, files: blogData.files })
                });
            })
        // eslint-disable-next-line
    }, [])

    const handleUpdateBLOG = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:5000/api/blog/updateblog/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ id: id, title: postData.title, summary: postData.summary, content: postData.content, files: postData.files })
        })
        if (localStorage.getItem('admin') === 'true') {
            console.log(localStorage.getItem('admin'))
            navigate('/');
        } else {
            console.log(localStorage.getItem('admin'))
            navigate('/myblogs');
        }
    }

    return (
        <>
            {!localStorage.getItem('token')
                ? <Login />
                : <main>
                    <form className='mt-3' onSubmit={handleUpdateBLOG}>
                        <input type="title" placeholder='Blog title' className='createBlogInput' value={postData.title} onChange={e => setPostData({ ...postData, title: e.target.value })} required={true} />
                        <input type="summary" placeholder='Summary' className='createBlogInput' value={postData.summary} onChange={e => setPostData({ ...postData, summary: e.target.value })} required={true} />
                        <FileBase type="file" multiple={false} value={postData.files} onDone={({ base64 }) => setPostData({ ...postData, files: base64 })} />
                        <ReactQuill theme="snow" value={postData.content} onChange={newValue => setPostData({ ...postData, content: newValue })} required={true} />
                        <button disabled={postData.content === ''} className='btn btn-primary createBlogInput'>UPDATE BLOG</button>
                    </form>
                </main>
            }
        </>
    )
}

export default EditBlog
