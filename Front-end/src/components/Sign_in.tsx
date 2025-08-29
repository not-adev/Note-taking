import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import type { GoogleUser } from '../types/googleRes';
import type { ResFromApi } from '../types/resFromSignIn';
import { useNavigate } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';




const Sign_in = () => {
    const route = useNavigate()
    const [loading, setLoading] = useState(false)
    const [otpGiven, setOtpGiven] = useState(false)
    const callErrorToast = (e: String) => toast.error(e, { position: "top-center",  })
    const callSucessToast = (e: String) => toast.success(e, { position: "top-center",  })
    const [formData, setFormData] = useState({
        email: '',
        OTP: '',
    });
    const [OTP, setOTP] = useState('')
    const [maxAge, setMaxAge] = useState(false)




    const validate = () => {
        const { email } = formData;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            callErrorToast("Please enter a valid email");
            return false;
        }

        // OTP validation (if shown)
        if (otpGiven && (formData.OTP != OTP)) {
            callErrorToast("Please enter a valid 4-digit OTP");
            return false;
        }
        return true


    }

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxAge(e.target.checked);

    }

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        console.log(formData)
    };

    const sendOTP = async () => {
        setLoading(true)
        try {

            const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
            setOTP(randomFourDigit.toString())
            // const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/otpVerification`, { email: formData.email, OTP: randomFourDigit })
            callSucessToast("OTP send to your Email ")
            // console.log(res.data)
            setOtpGiven(true)
        } catch (error: any) {
            callErrorToast(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true)
            if (!otpGiven) {
                if (validate()) {
                    const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
                    setOTP(randomFourDigit.toString())

                    // const res = await axios.post(`${import.meta.env.VITE_BACK_END_URL}/otpVerification`, { email: formData.email, OTP: randomFourDigit })
                    callSucessToast("OTP send to your Email ")
                    // console.log(res.data)
                    setOtpGiven(true)

                }


                return
            }
            if (validate()) {
                const res = await axios.post<ResFromApi>(`${import.meta.env.VITE_BACK_END_URL}/signin`,
                    {
                        email: formData.email,
                        maxAge
                    })
                if (res.data.code == 1) {
                    callSucessToast("Sign In Completed")
                    setTimeout(() => {
                        route('/')
                    }, 15000);



                }
                else if (res.data.code == 0) {
                    callErrorToast("User does not exist please Sign Up ")
                    route("/signup")
                }
                else {
                    callErrorToast(res.data.message)
                }

            }

        } catch (error: any) {
            callErrorToast("Some error occured try again later  ")
            console.log(error)
        }
        finally {


            setLoading(false)

        }


    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.get<GoogleUser>('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                console.log("User Info:", res.data);
                // Example output:
                // {
                //   sub: "1234567890",
                //   name: "John Doe",
                //   given_name: "John",
                //   family_name: "Doe",
                //   picture: "https://lh3.googleusercontent.com/...",
                //   email: "john.doe@gmail.com",
                //   email_verified: true,
                //   locale: "en"
                // }

                const back_end_call = await axios.post<ResFromApi>(`${import.meta.env.VITE_BACK_END_URL}/signin`,
                    {
                        email: res.data.email,
                        maxAge: true
                    })
                if (back_end_call.data.code == 1) {
                    route("/notes")
                }


            } catch (err) {
                console.error("Failed to fetch user info:", err);
            }
        },
        onError: () => {
            console.log("Login Failed");
        }
    });

    return (


        <>
            <div className="md:flex h-screen   overflow-y-hidden">
                <div className="flex md:absolute items-center bg-amb mt-4 md:mt-0  top-1 left-4 justify-center text-2xl font-bold ">

                    <div className='flex  justify-end items-center gap-4'>

                        <img src="logo.png" alt="img" className='w-[32px] h-[32px]' />
                        <div className='text-2xl mb-4 md:mb-0 font-semibold'>

                            Hd
                        </div>


                    </div>
                </div>
                <div className="w-1/2  max-h-screen m-auto  relative flex flex-col justify-center items-center ">

                    <div className="text-center flex flex-col ">
                        <div>
                            <div className=' text-[30px] font-bold md:text-left px-6'>
                                Sign In
                            </div>
                            <div className='text-gray-400 pt-1 h-[27px] md:text-left px-6'>
                                Sign up to enjoy the feature of HD
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="w-[359px] mx-auto mt-1 text-sm p-6 bg-white rounded-lg space-y-6 ">






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

                                            type="password"
                                            name="OTP"
                                            value={formData.OTP}
                                            onChange={handleInput}
                                            className="w-full border h-[40px] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="OTP"
                                        />
                                    </div>
                                }

                                {
                                    otpGiven && <div onClick={() => sendOTP()} className='text-blue-500 underline text-left cursor-pointer '> Resend OTP </div>
                                }
                                {
                                    otpGiven && <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={maxAge}
                                            onChange={handleCheck}
                                        />
                                        <span>Remeber Me </span>
                                    </label>

                                }
                                {
                                    otpGiven &&
                                    <button disabled={loading} type='submit' className='bg-blue-500 cursor-pointer  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[54px]'>{loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                                        </div>
                                    ) : 'Sign In '}
                                    </button>
                                }


                            </div>
                        </form>
                        <button
                            onClick={() => login()}
                            className="flex m-auto items-center justify-center cursor-pointer w-[315px] h-[50px]  py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition duration-200 shadow-sm disabled:opacity-60"
                        >

                            <img src="https://i.pinimg.com/1200x/60/41/99/604199df880fb029291ddd7c382e828b.jpg" className='h-full ' alt="google" />
                            Sign in with Google
                        </button>
                        <div>
                            Dont have an account??<Link className='text-blue-500 ' to="/signup"> Sign Up </Link>
                        </div>
                    </div>

                </div>


                <div className="w-2/3 hidden  h-screen rounded-2xl p-1 bg-white md:flex items-center justify-center">
                    <img
                        src="signUpimg.jpg"
                        alt="Sample Image"
                        className="max-w-full h-full object-cover rounded shadow-lg"
                    />
                </div>
            </div>
            <ToastContainer />
        </>
    );
};
export default Sign_in;











