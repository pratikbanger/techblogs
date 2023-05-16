import React, { useEffect, useState } from 'react'
import './CSS/BlogPage.css';
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';

const BlogPage = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    const [blogByID, setBlogByID] = useState([])
    const [author, setAuthor] = useState('')
    const [createdAt, setCreatedAt] = useState('')

    const { id } = useParams();

    const getBlogByID = async (id) => {
        const response = await fetch(`${backendLink}/api/blog/${id}`)
        const json = await response.json();
        setBlogByID(json);
        setAuthor(json.user.username)
        setCreatedAt(format(new Date(json.createdAt), 'MMM d, yyyy'))
    }

    useEffect(() => {
        getBlogByID(id)
        // eslint-disable-next-line
    }, [])

    return (
        <main>
            <div className='container d-flex justify-content-center flex-column'>
                <h1 className='mt-4 fw-bold blogHeading'>{blogByID.title}</h1>
                <p className='text-center my-2'>Posted by <strong className='text-lowercase'>@{author}</strong> On {createdAt}</p>
            </div>
            <div className='my-3 d-flex justify-content-center'>
                <img className='blogImage' src={blogByID.files} alt="" />
            </div>
            <h4 className='my-4'>{blogByID.summary}</h4>
            <div dangerouslySetInnerHTML={{ __html: blogByID.content }} />
        </main>
    )
}

export default BlogPage
