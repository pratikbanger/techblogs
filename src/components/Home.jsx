import React from 'react'
import Blogs from './Blogs';
import NavBar from './NavBar';
import CreateBlog from './CreateBlog';
import AdminPage from './AdminPage';
import Login from './Login';
import Signup from './Signup';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import BlogPage from './BlogPage';
import MyBlogs from './MyBlogs';
import EditBlog from './EditBlog';

const Home = () => {

    return (
        <>
            <Router>
                <NavBar />
                <Routes>
                    <Route exact path='/' element={<Blogs />} />
                    <Route exact path='/myblogs' element={<MyBlogs />} />
                    <Route exact path='/blog/:id' element={<BlogPage />} />
                    <Route exact path='/createblog' element={<CreateBlog />} />
                    <Route exact path='/editblog/:id' element={<EditBlog />} />
                    <Route exact path='/manageblogs' element={<AdminPage />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/signup' element={<Signup />} />
                </Routes>
            </Router>
        </>
    )
}

export default Home
