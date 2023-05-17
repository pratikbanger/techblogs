import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/CreateBlog.css'
import loadingSpinner from './loadingSpinner.gif'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileBase from 'react-file-base64';
import Login from './Login';

const CreateBlog = () => {

  let navigateTo = useNavigate();

  const backendLink = process.env.REACT_APP_BACKEND_LINK

  const [postData, setPostData] = useState({ title: '', summary: '', content: '', files: '' });

  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('danger')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreateBLOG = (e) => {
    e.preventDefault();
    setLoading(true)
    const addBlog = async (title, summary, content, files) => {
      // API call
      const response = await fetch(`${backendLink}/api/blog/addblog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ title, summary, content, files })
      })
      const json = await response.json()
      setLoading(false)
      if (!json.success) {
        setAlertMessage(json.message)
        setIsActive(true)
        setTimeout(() => {
          setIsActive(false)
        }, 3000);
      } else {
        setAlertMessage(json.message)
        setAlertType('success')
        setIsActive(true)

        setTimeout(() => {
          navigateTo('/')
        }, 2000);
      }
    }
    addBlog(postData.title, postData.summary, postData.content, postData.files);
  }

  return (
    <>
      {!localStorage.getItem('token')
        ? <Login />
        : <main>
          {loading && <div className='container mt-5 d-flex justify-content-center' style={{ width: "120px", height: "120px" }}>
            <img src={loadingSpinner} alt="loading..." />
          </div>}
          <form className='mt-3' onSubmit={handleCreateBLOG}>
            <div id='signUpSuccess' className={`alert ${alertType === 'danger' ? 'alert-danger' : 'alert-success'} ${!isActive ? 'd-none' : null}`} role="alert">
              {alertMessage}
            </div>
            <input type="title" placeholder='Blog title' className='createBlogInput' value={postData.title} onChange={e => setPostData({ ...postData, title: e.target.value })} required={true} />
            <input type="summary" placeholder='Summary' className='createBlogInput' value={postData.summary} onChange={e => setPostData({ ...postData, summary: e.target.value })} required={true} />
            <FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, files: base64 })} />
            <ReactQuill theme="snow" value={postData.content} onChange={newValue => setPostData({ ...postData, content: newValue })} required={true} />
            <button disabled={postData.content === ''} className='btn btn-primary createBlogInput'>POST BLOG</button>
          </form>
        </main>
      }
    </>
  )
}

export default CreateBlog
