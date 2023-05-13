import React from 'react'
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {

    let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('admin');
        navigate('/login');
    }

    return (
        <nav className="navbar bg-dark navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
                <p className="navbar-brand font-weight-bold p-0 m-0">Tech Blogs</p>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Home</Link>
                        </li>
                        {localStorage.getItem('token') &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/createblog">Create Blog</Link>
                            </li>
                        }
                    </ul>
                    {!localStorage.getItem('token') ?
                        <form className="d-flex" role="search">
                            <Link className='btn btn-outline-info mx-1 btn-sm' to="/login" role="button">Login</Link>
                            <Link className='btn btn-outline-info mx-1 btn-sm' to="/signup" role="button">SignUp</Link>
                        </form>
                        :
                        <>
                            <span className='btn btn-outline-info btn-sm mx-2 px-2 fw-bold' role="button">
                                <Link to="/myblogs" className="resetLink">
                                    <i className="fa-solid me-2 fa-user"></i>
                                    {localStorage.getItem('userName').split(' ')[0]}
                                </Link>
                            </span>
                            <Link className='btn btn-outline-danger mx-1 btn-sm' to="/" onClick={handleLogout} role="button">Logout</Link>
                        </>
                    }
                </div>
            </div>
        </nav>
    )
}

export default NavBar
