import React, { useEffect, useState } from 'react'
import './CSS/Blog.css';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Blogs = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    const [blog, setBlog] = useState([])
    const [keyword, setKeyword] = useState('')

    const getBlogs = async () => {
        // API call
        const response = await fetch(`${backendLink}/api/blog/getblogs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setBlog(json);
    }

    useEffect(() => {
        getBlogs()
        // eslint-disable-next-line
    }, [])

    const handleDeleteBlog = async (e, id) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this Blog?');

        if (confirmDelete) {
            await fetch(`${backendLink}/api/blog/deleteblog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            })
            getBlogs()
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();

        const getBlogs = async (keyword) => {
            // API call
            const response = await fetch(`${backendLink}/api/blog/searchblogs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ keyword })
            });
            const json = await response.json();
            setBlog(json);
        }

        getBlogs(keyword)
    }

    return (
        <main>
            <div className='container mt-3 d-flex justify-content-center'>
                <input type='search' value={keyword} onChange={e => setKeyword(e.target.value)} className='searchInput mx-2 px-2'></input>
                <button className='mx-2 btn btn-primary' onClick={handleSearch}>Search</button>
            </div>
            {blog.length === 0 ?
                <div className='container mt-3 d-flex justify-content-center'>
                    <h1 className='fw-bold'>No blog found</h1>
                </div>
                : blog.map((data) => (
                    <div key={data._id} className='blog-container'>
                        <div className=''>
                            <img className="post-image" src={data.files} alt="" />
                        </div>
                        <div className='post-text'>
                            <Link to={`/blog/${data._id}`} className='resetLink'>
                                <h1>{data.title.length > 60 ? data.title.substr(0, 60) + "..." : data.title}</h1>
                            </Link>
                            <p className='m-0 my-2 blog-info'><strong><a href="/" className='author'>{data.user.username} </a></strong> posted On {format(new Date(data.createdAt), 'MMM d, yyyy')}</p>
                            <p>{data.summary.length > 60 ? data.summary.substr(0, 200) + "..." : data.summary}</p>
                            {/* Summary length should be less than 148 words */}

                            {localStorage.getItem('admin') === 'true' &&
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex align-items-center'>
                                        <Link to={`/editblog/${data._id}`} className='resetLink'>
                                            <i className="fa-solid mx-2 fa-pen"></i>
                                            <strong>Edit Post</strong>
                                        </Link>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <button className='myBtn' onClick={e => handleDeleteBlog(e, data._id)}>
                                            <i className="fa-solid fa-trash"></i>
                                            <strong className='mx-2'>Delete Post</strong>
                                        </button>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                ))}
        </main>
    )
}

export default Blogs
