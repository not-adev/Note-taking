import React from 'react'
import { GoogleLogin,googleLogout } from '@react-oauth/google'
const Sign_in = () => {
    return (
        <GoogleLogin onSuccess={(user) => {
            console.log(user.credential)
        }}
            onError={() => {
                console.log("error ")
            }}

        />


    )
}

export default Sign_in