import React, { useState } from 'react'
import { OrbitProgress } from 'react-loading-indicators';
interface SignUpFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: {
        name: string;
        dob: string;
        email: string;
        OTP: string;
    };
    otpGiven: boolean;
    loading: boolean;
}


const SignUpForm: React.FC<SignUpFormProps> = ({
    handleSubmit,
    handleInput,
    formData,
    otpGiven,
    loading, }) => {

    const [showPassword, setShowPassword] = useState(false);
    return (
        <form onSubmit={handleSubmit}>
            <div className="w-[359px] mx-auto mt-1 text-sm p-6 bg-white rounded-lg space-y-6 ">

                <div className="relative  ">
                    <label className="absolute -top-2.5 left-2  bg-white px-1 text-xs text-gray-600">
                        Name
                    </label>
                    <input
                        type="text"
                        required
                        name='name'
                        value={formData.name}
                        onChange={handleInput}

                        className="w-full border h-[40px] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>


                <div className="relative ">
                    <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-600">
                        Date of Birth
                    </label>
                    <input
                        required
                        name="dob"
                        value={formData.dob}
                        onChange={handleInput}
                        type="date"
                        className="w-full border h-[40px] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>


                <div className="relative ">
                    <label className="absolute -top-2.5  left-2 bg-white px-1 text-xs text-gray-600">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInput}
                        required
                        className="w-full h-[40px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
                {


                    !otpGiven &&
                    <button disabled={loading} type='submit' className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[54px]'>{loading ? (
                        <div className="flex items-center justify-center h-full">
                            <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                        </div>
                    ) : 'Get otp'}  </button>
                }

                {
                    otpGiven &&
                    <div className="relative ">

                        <input

                            type={showPassword ? 'text' : 'password'}
                            name="OTP"
                            value={formData.OTP}
                            onChange={handleInput}
                            className="w-full border h-[40px] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="OTP"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-2 text-xs text-blue-600 hover:underline"
                        >
                            {!showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" color='black' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon  icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" color='black' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>}
                        </button>


                    </div>
                }

                {
                    otpGiven &&
                    <button disabled={loading} type='submit' className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[50px]'>{loading ? (
                        <div className="flex items-center justify-center h-full">
                            <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                        </div>
                    ) : 'Sign Up'}  </button>
                }

            </div>
        </form>
    )
}

export default SignUpForm