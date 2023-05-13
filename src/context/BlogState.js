import { useState } from "react";
import blogContext from "./blogContext";

const BlogState = (props) => {

    const [isAdmin, setIsAdmin] = useState(false);


    return (
        <blogContext.Provider value={{ isAdmin, setIsAdmin }}>
            {props.children}
        </blogContext.Provider>
    )

}

export default BlogState;