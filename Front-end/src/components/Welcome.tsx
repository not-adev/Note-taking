import React from 'react'

interface WelcomeTypes {
  email : string;
  name : string;
}

const Welcome :React.FC<WelcomeTypes> = ({email  ,name}) => {
    return (
        <div className="border border-green-400 rounded-md p-4 mb-4 bg-green-50">
            <p className="text-lg font-medium text-green-700">Welcome, {name}</p>
            <p className="text-sm text-green-600">Email: {email}</p>
        </div>
    )
}

export default Welcome