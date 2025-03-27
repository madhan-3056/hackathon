import React from 'react'

const index = () => {

    const getUser = () => {
        fetch("http://localhost:5001/api/user")
        .then(res => res.json())
        .then(json => console.log(json))   

    }

    useEffect(() => {
        getUser()
    })

    return (
    
            APP
        
    )


}