import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { IoIosClose } from "react-icons/io";

export default function Connect({ setShowConnect }) {
    const [state, handleSubmit] = useForm("xbljojyw");

    // Use event parameter to prevent default behavior
    const handleSubmitForm = (event) => {
        event.preventDefault(); // Prevent page reload
        handleSubmit(event); // Call Formspree's handleSubmit function
        if (state.succeeded) {
            setShowConnect(false);
        }
    };

    if (state.succeeded) {
        setShowConnect(false);
    }

    return (
        <form className='absolute z-20 shadow-sm shadow-white flex flex-col gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 items-center justify-center transition-all duration-200 text-white px-10 py-20 sm:w-[400px] md:h-[400px] rounded-md' onSubmit={handleSubmitForm}>
            <div onClick={() => {
                setShowConnect(false);
            }} className='absolute top-1 right-1 text-3xl cursor-pointer text-gray-300'>
                <IoIosClose />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="email">
                    Email Address
                </label>
                <input
                    className='px-2 py-1 rounded-md outline-none border-white bg-slate-800 text-slate-100 border'
                    id="email"
                    type="email"
                    name="email"
                />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="name">
                    Name
                </label>
                <input
                    className='px-2 py-1  rounded-md outline-none border-white bg-slate-800 text-slate-100 border'
                    id="name"
                    type="text"
                    name="name"
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="message">
                    Message
                </label>
                <textarea
                    className='px-2 py-1 rounded-md outline-none border-white bg-slate-800 text-slate-100 border'
                    id="message"
                    name="message"
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                />
            </div>
            <button className='bg-purple-600 hover:bg-purple-800 transition-all duration-200 hover:text-slate-300 text-sm mx-auto w-fit px-4 py-2 rounded-md' type="submit" disabled={state.submitting}>
                Submit
            </button>
        </form>
    );
}
