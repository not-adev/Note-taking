import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import type { GoogleUser } from '../types/googleRes';
import type { ResFromApi } from '../types/resFromSignIn';

const SignUpForm = React.lazy(() => {
  return new Promise<typeof import('./SignUpFor')>((resolve) => {
    setTimeout(() => {
      resolve(import('./SignUpFor'));
    }, 2000); // Simulate 2-second delay
  });
});

import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Suspense } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';





const Sign_up = () => {
  const route = useNavigate()

  const [loading, setLoading] = useState(false)
  const [otpGiven, setOtpGiven] = useState(false)
  const callErrorToast = (e: String) => toast.error(e, { position: "top-center", })
  const callSucessToast = (e: String) => toast.success(e, { position: "top-center", })
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
          console.log(randomFourDigit)
          setOTP(randomFourDigit.toString())
          toast.promise(
            async () =>
              await axios.post(`${import.meta.env.VITE_BACK_END_URL}/otpVerification`, {
                email: formData.email,
                OTP: randomFourDigit,
              }),
            {
              pending: 'processing...',
              success: 'OTP send successfully 🎉',
              error: 'OTP cannt be send failed ❌',
            }
          );


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
          setTimeout(() => {

            route('/')
          }, 3000);



        }
        else if (res.data.code == 0) {
          callSucessToast("User alredy exist please Sign In ")
          setTimeout(() => {

            route('/')
          }, 3000);

        }
        else {
          callErrorToast(res.data.message)
        }

      }

    } catch (error: any) {
      callErrorToast(error)
      console.log(error)
    }
    finally {


      setLoading(false)

    }


  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true)
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
            picture: res.data.picture

          }, { withCredentials: true })
        if (back_end_call.data.code == 1) {
          callSucessToast("Sign In Completed")
          setTimeout(() => {
            route('/notes')
          }, 1500);



        }
        else if (back_end_call.data.code == 0) {
          callErrorToast("Google Sing Up not Working try another way")

        }
        else {
          callErrorToast(back_end_call.data.message)
        }


      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
      finally {
        setLoading(false)
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
        <div className="w-[359px] md:h-[90%] m-auto  relative flex flex-col justify-center items-center ">

          <div className="text-center flex flex-col ">
            <div>
              <div className=' text-[30px] font-bold md:text-left px-6'>
                Sign Up
              </div>
              <div className='text-gray-400 pt-1 h-[27px] md:text-left px-6'>
                Sign up to enjoy the feature of HD
              </div>
            </div>
            <Suspense fallback={
              <div className="w-[359px] mx-auto mt-1 text-sm p-6 bg-white rounded-lg space-y-6">
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={54} />
              </div>
            }
            >
              <SignUpForm
                handleSubmit={handleSubmit}
                handleInput={handleInput}
                formData={formData}
                otpGiven={otpGiven}
                loading={loading}
              />
            </Suspense>

            {/* <form onSubmit={handleSubmit}>
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
            </form> */}

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





