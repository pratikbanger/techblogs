import React, { useEffect, useState } from 'react'
import './CSS/BlogPage.css';
import { useParams } from 'react-router-dom'

const BlogPage = () => {

    const backendLink = process.env.REACT_APP_BACKEND_LINK
    const [blogByID, setBlogByID] = useState([])

    const { id } = useParams();

    useEffect(() => {

        const getBlogByID = async (id) => {
            const response = await fetch(`${backendLink}/api/blog/${id}`)

            const json = await response.json();
            setBlogByID(json);
        }

        getBlogByID(id)
        // eslint-disable-next-line
    }, [])

    return (
        <main>
            <h1 className='mt-4 fw-bold blogHeading'>{blogByID.title}</h1>
            <div className='my-3 d-flex justify-content-center'>
                <img className='blogImage' src={blogByID.files} alt="" />
            </div>
            <h4 className='my-4'>{blogByID.summary}</h4>
            <div dangerouslySetInnerHTML={{ __html: blogByID.content }} />
        </main>
    )
}

export default BlogPage
