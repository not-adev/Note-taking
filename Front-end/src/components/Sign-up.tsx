import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import type { GoogleUser } from '../types/googleRes';
import type { ResFromApi } from '../types/resFromSignIn';
import { useNavigate } from 'react-router-dom';

const Sign_up = () => {
  const route = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpGiven, setOtpGiven] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    OTP: 0,
  });
  const [OTP, setOTP] = useState(0)

  const validate = () => {
    const { name, email, dob } = formData;

    // Name must be at least 2 characters
    if (!name.trim() || name.trim().length < 2) {
      alert("Name must be at least 2 characters long");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      alert("Please enter a valid email");
      return false;
    }

    // DOB required
    if (!dob) {
      alert("Date of birth is required");
      return false;
    }

    // OTP validation (if shown)
    if (otpGiven && (formData.OTP !== OTP)) {
      alert("Please enter a valid 4-digit OTP");
      return false;
    }
    return true


  }

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData)
  };

  const generatOTP = () => {
    const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
    setOTP(randomFourDigit)
    console.log(randomFourDigit);
  }

  const handleSubmit = async (e: any) => {

    e.preventDefault();
    try {

      setLoading(true)
      if (!otpGiven) {
        if (validate()) {
          generatOTP()
          const res = await axios.post(`${process.env.VITE_BACK_END_URL}/otpVerification}`, { email: formData.email  , OTP : OTP})
          setOtpGiven(true)
          console.log(res.data)
          return
        }
      }
      if (validate()) {
        const res = await axios.post<ResFromApi>(`${process.env.VITE_BACK_END_URL}/signup`,
          {
            name: formData.name,
            email: formData.email,
            dob: formData.dob

          })
        if (res.data.code == 1) {

          route('/signin')
        }
        else {
          alert(res.data.message)
        }

      }

    } catch (error: any) {
      alert(error.message)
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

        const back_end_call = await axios.post<ResFromApi>(`${process.env.VITE_BACK_END_URL}/signin`,
          {
            name: res.data.name,
            email: res.data.email,

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

    // <button
    //     onClick={() => login()}
    //     classNameName="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    // >
    //     Sign in with Google
    // </button>
    <>
      <div className="md:flex h-screen   overflow-y-hidden">
        <div className="flex md:absolute items-center bg-amb mt-4  top-1 left-4 justify-center text-2xl font-bold ">

          <div className='flex  items-center gap-4'>

            <img src="logo.png" alt="img" className='w-[32px] h-[32px]' />
            <div className='text-2xl font-semibold'>

              Hd
            </div>

          </div>
        </div>
        <div className="w-1/2 max-h-screen m-auto  relative flex flex-col justify-center items-center">

          <div className="text-center flex flex-col ">
            <div>
              <div className=' text-[44px] font-bold md:text-left px-6'>
                Sign Up
              </div>
              <div className='text-gray-400 pt-1 h-[27px] md:text-left px-6'>
                Sign up to enjoy the feature of HD
              </div>
            </div>
            <form action={handleSubmit}>
              <div className="w-[399px] mx-auto mt-1 p-6 bg-white rounded-lg ">

                <div className="relative  h-[59px]">
                  <label className="absolute -top-2.5 left-2  bg-white px-1 text-sm text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    name='name'
                    value={formData.name}
                    onChange={handleInput}

                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>


                <div className="relative h-[59px]">
                  <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    required
                    name="dob"
                    value={formData.dob}
                    onChange={handleInput}

                    type="date"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


                <div className="relative  h-[59px]">
                  <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInput}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                {


                  !otpGiven &&
                  <button type='submit' className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[54px]'>Get otp </button>
                }

                {
                  otpGiven &&
                  <div className="relative h-[59px]">

                    <input

                      type="number"
                      name="OTP"
                      value={formData.OTP}
                      onChange={handleInput}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="OTP"
                    />
                  </div>
                }

                {
                  otpGiven &&
                  <button type='submit' className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[54px]'>Sign Up </button>
                }

              </div>
            </form>
          </div>
        </div>


        <div className="w-2/3 hidden  h-screen rounded-2xl p-3 bg-white md:flex items-center justify-center">
          <img
            src="signUpimg.jpg"
            alt="Sample Image"
            className="max-w-full h-full object-cover rounded shadow-lg"
          />
        </div>
      </div>
    </>
  );
};
export default Sign_up;





