"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { useAuth } from "../context/auth-provider";
import { useTheme } from "../context/theme-provider";
import { BsMoonFill, BsSun } from 'react-icons/bs'
import { IoIosLogOut } from 'react-icons/io'


const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const { user, handleSignOut, handleSignIn, handleSignInWithGoogle } = useAuth();
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      handleCloseLoginDialog();
    }
  }, [user]);

  const handleUpgradeClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  return (
    <div className="top-0 left-0 right-0 flex justify-between items-center p-4 bg-white">
      {user ? (
        <div className="flex justify-between w-full">
          <button
            onClick={handleUpgradeClick}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Upgrade
          </button>
          <div className="flex flex-row">
          <div className="flex items-center">
            {dark ? <BsMoonFill className="mr-2"/> : <BsSun className="mr-2"/>}
            <Switch
            checked={dark}
            onChange={toggleTheme}
            className={`${dark ? 'bg-gray-800' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Switch theme</span>
            <span
              className={`${dark ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition `}
            />
          </Switch>
          </div>
          
          <button
            onClick={handleSignOut}
            className="text-gray-800 py-2 px-4 rounded inline-flex items-center ml-4"
          >
            <IoIosLogOut className="mr-2" />
            Log Out
          </button>
          </div>
        </div>
      ) : (
        <div className="ml-auto flex flex-row items-center space-x-4">
          <div className="flex items-center">
            {dark ? <BsMoonFill /> : <BsSun />}
          </div>
          <Switch
            checked={dark}
            onChange={toggleTheme}
            className={`${dark ? 'bg-gray-800' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Switch theme</span>
            <span
              className={`${dark ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <button
            onClick={handleOpenLoginDialog}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Upgrade & Log Out */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleCloseDialog}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Dialog - Upgrade */}
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-3xl font-medium leading-6 text-gray-900 mb-4">
                  Hey there!
                </div>
                <div className="mt-2 mb-6">
                  <p className="text-sm text-gray-500">
                    We are building the SaaS of the future for higher education.
                  </p>
                  <p className="text-sm text-gray-500 font-bold">
                    Subscribe so you can be the first one to test it.
                  </p>
                </div>
                <button
                  className="w-full py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700"
                  onClick={() => window.open('https://www.culqi.com/')}
                >
                  Start now
                </button>
              </div>


            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Sign In */}
      <Transition appear show={isLoginDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleCloseLoginDialog}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Welcome back
                  </h1>
                  <button
                    onClick={() => handleSignInWithGoogle()}
                    className="w-full text-gray-800 bg-transparent border-gray-300 border font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                    Sign in with Google
                  </button>
                  <div className="flex flex-row items-center">
                    <div className="w-1/2 border-t border-gray-300"></div>
                    <p className="text-center bg-white px-3 inline-block">or</p>
                    <div className="w-1/2 border-t border-gray-300"></div>
                  </div>
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" required />
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 " />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="remember" className="text-gray-500 ">Remember me</label>
                        </div>
                      </div>
                      <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                  </form>

                  <p className="text-sm font-light text-gray-500 ">
                    Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline ">Sign up</a>
                  </p>

                </div>
              </div>



            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Header;
