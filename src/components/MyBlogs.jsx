import React, { useEffect, useState } from 'react'
import './CSS/MyBlogs.css';
import loadingSpinner from './loadingSpinner.gif'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Login from './Login';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyBlogs = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    const [getMyBlogs, setGetMyBlogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalResults, setTotalResults] = useState(0)
    const [page, setPage] = useState(1)

    const myBlogs = async () => {
        setLoading(true)
        const response = await fetch(`${backendLink}/api/blog/myblogs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setLoading(false)
        setGetMyBlogs(json.myBlogs)
        setTotalResults(json.totalResults)
    }

    useEffect(() => {
        myBlogs()
        // eslint-disable-next-line
    }, [])

    const handleDeleteBlog = async (e, id) => {
        e.preventDefault()
        setLoading(true)
        await fetch(`${backendLink}/api/blog/deleteblog/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        setLoading(false)
        myBlogs()
    }

    const fetchMoreData = async () => {
        // API call
        const response = await fetch(`${backendLink}/api/blog/myblogs?page=${page + 1}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        setPage(page + 1)
        const json = await response.json()
        setGetMyBlogs(getMyBlogs.concat(json.myBlogs))
        setTotalResults(json.totalResults)
    }

    return (
        <>
            {!localStorage.getItem('token')
                ? <Login />
                : <main>
                    <div className='container d-flex justify-content-center'>
                        <h2 className='fw-bold mt-3'>MY BLOGS</h2>
                    </div>
                    {getMyBlogs.length === 0 &&
                        <div className='container mt-2 d-flex justify-content-center'>
                            {loading && <img style={{ width: "70px" }} src={loadingSpinner} alt="loading..." />}
                            {!loading && <p className='fw-bold mt-5 text-danger'>You haven't created any Blog yet! click here to <Link to="/createblog">Create blog</Link></p>}
                        </div>}
                    <InfiniteScroll
                        dataLength={getMyBlogs.length}
                        next={fetchMoreData}
                        hasMore={getMyBlogs.length !== totalResults}
                        loader={
                            <div className='container mt-5 d-flex justify-content-center'>
                                <img style={{ width: "70px" }} src={loadingSpinner} alt="loading..." />
                            </div>
                        }
                    >
                        {getMyBlogs.map((data) => (
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
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex align-items-center'>
                                            <Link to={`/editblog/${data._id}`} className='resetLink'>
                                                <i className="fa-solid mx-2 fa-pen"></i>
                                                <strong>Edit Post</strong>
                                            </Link>
                                        </div>
                                        <div className='d-flex align-items-center'>
                                            <button type="button" className='myBtn' data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                <i className="fa-solid fa-trash"></i>
                                                <strong className='mx-2'>Delete Post</strong>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm modal */}
                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete Blog</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure you want to delete this Blog?
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={e => handleDeleteBlog(e, data._id)}>Confirm Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </main>
            }
        </>
    )
}

export default MyBlogs
