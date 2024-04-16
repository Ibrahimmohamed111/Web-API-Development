import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function AuthHOC(WrappedComponent) {

    return function WithValidation() {
        const navigate = useNavigate()
        const [isAuthenticated, setIsAuthenticated] = useState(null)
        useEffect(() => {
            fetch("http://localhost:5000/authorize", {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(res => {
                    console.log("rws ", res)
                    if (res.token) {
                        setIsAuthenticated(true)
                    }
                    else {
                        setIsAuthenticated(false)
                        navigate("/login")
                    }

                })
        }, [])

        return isAuthenticated === null ? "loading..." : (
            isAuthenticated ? <WrappedComponent /> : null
        )
    }
}


export default AuthHOC





