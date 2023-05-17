import React, { useEffect, useState } from 'react'
import './CSS/Blog.css';
import loadingSpinner from './loadingSpinner.gif'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';


const Blogs = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    const [blog, setBlog] = useState([])
    const [blogID, setBlogID] = useState(null)
    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(false)
    const [totalResults, setTotalResults] = useState(0)
    const [page, setPage] = useState(1)

    const getBlogs = async () => {
        setLoading(true)
        // API call
        const response = await fetch(`${backendLink}/api/blog/getblogs?page=${page}&limit=4`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await response.json();
        setBlog(json.allBlogs)
        setTotalResults(json.totalResults)
        setLoading(false)
    }

    useEffect(() => {
        getBlogs()
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
        setBlogID(null)
        setLoading(false)
        getBlogs()
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true)
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
            setLoading(false)
            setBlog(json);
        }
        getBlogs(keyword)
    }

    const fetchMoreData = async () => {
        // API call
        const response = await fetch(`${backendLink}/api/blog/getblogs?page=${page + 1}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        setPage(page + 1)
        const json = await response.json()
        setBlog(blog.concat(json.allBlogs))
        setTotalResults(json.totalResults)
    }

    return (
        <main>
            <div className='container mt-3 d-flex justify-content-center'>
                <input type='search' value={keyword} onChange={e => setKeyword(e.target.value)} className='searchInput mx-2 px-2'></input>
                <button className='mx-2 btn btn-primary' onClick={handleSearch}>Search</button>
            </div>

            {/* Confirm modal */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={e => handleDeleteBlog(e, blogID)}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            {blog.length === 0 &&
                <div className='container mt-5 d-flex justify-content-center'>
                    {!loading && <h1 className='fw-bold'>No blog found</h1>}
                </div>}
            {loading &&
                <div className='container mt-5 d-flex justify-content-center' style={{ width: "120px", height: "120px" }}>
                    <img src={loadingSpinner} alt="loading..." />
                </div>}
            <InfiniteScroll
                dataLength={blog.length}
                next={fetchMoreData}
                hasMore={blog.length !== totalResults}
                loader={
                    <div className='container mt-5 d-flex justify-content-center' style={{ width: "120px", height: "120px" }}>
                        <img src={loadingSpinner} alt="loading..." />
                    </div>
                }
            >
                {blog.map((data) => (
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

                            {/* {isAdmin && */}
                            {localStorage.getItem('techBlogAdmin') === 'true' &&
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex align-items-center'>
                                        <Link to={`/editblog/${data._id}`} className='resetLink'>
                                            <i className="fa-solid mx-2 fa-pen"></i>
                                            <strong>Edit Post</strong>
                                        </Link>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <button className='myBtn' onClick={e => setBlogID(data._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
                                            <i className="fa-solid fa-trash"></i>
                                            <strong className='mx-2'>Delete Post</strong>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </main>
    )
}

export default Blogs
