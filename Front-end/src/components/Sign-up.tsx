import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import type { GoogleUser } from '../types/googleRes';
import type { ResFromApi } from '../types/resFromSignIn';
import { useNavigate } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';




const Sign_up = () => {
  const route = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpGiven, setOtpGiven] = useState(false)
  const callErrorToast = (e: string) => toast.error(e, { position: "top-right", })
  const callSucessToast = (e: string) => toast.success(e, { position: "top-right", })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    OTP: '',
  });
  const [OTP, setOTP] = useState('')

  useEffect(() => {
    console.log(otpGiven)


  }, [otpGiven])


  const validate = () => {
    const { name, email, dob } = formData;

    // Name must be at least 2 characters
    if (!name.trim() || name.trim().length < 2) {
      callErrorToast("Name must be at least 2 characters long");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      callErrorToast("Please enter a valid email");
      return false;
    }

    // DOB required
    if (!dob) {
      callErrorToast("Date of birth is required");
      return false;
    }

    // OTP validation (if shown)
    if (otpGiven && (formData.OTP != OTP)) {
      callErrorToast("Please enter a valid 4-digit OTP");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("sunmhsdj")
    try {

      setLoading(true)
      if (!otpGiven) {
        if (validate()) {
          console.log("nside if ")
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
        const res = await axios.post<ResFromApi>(`${import.meta.env.VITE_BACK_END_URL}/signup`,
          {
            name: formData.name,
            email: formData.email,
            dob: formData.dob

          })
        if (res.data.code == 1) {
          callSucessToast("Signup Completed moving to Sign In ")
          route('/')



        }
        else if (res.data.code == 0) {
          alert("User alredy exist please Sign In ")
          route("/")
        }
        else {
          alert(res.data.message)
        }

      }

    } catch (error: any) {
      alert(error)
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

        const back_end_call = await axios.post<ResFromApi>(`${import.meta.env.VITE_BACK_END_URL}/signup_withGoogle`,
          {
            name: res.data.name,
            email: res.data.email,
            picture : res.data.picture

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
                Sign Up
              </div>
              <div className='text-gray-400 pt-1 h-[27px] md:text-left px-6'>
                Sign up to enjoy the feature of HD
              </div>
            </div>
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

                      type="number"
                      name="OTP"
                      value={formData.OTP}
                      onChange={handleInput}
                      className="w-full border h-[40px] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="OTP"
                    />
                  </div>
                }

                {
                  otpGiven &&
                  <button type='submit' className='bg-blue-500  border border-blue-500 w-full text-white text-xl hover:bg-blue-700 transition duration-400 rounded-md h-[50px]'>Sign Up </button>
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
              Already have an account??<Link className='text-blue-500' to="/signin"> Sign In </Link>
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
export default Sign_up;





