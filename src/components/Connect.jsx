import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { IoIosClose } from "react-icons/io";

export default function Connect({ setShowConnect }) {
    const [state, handleSubmit] = useForm("");

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
        <form className="absolute z-20 flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#141622] px-10 py-12 text-white shadow-xl shadow-black/40 sm:w-[400px]" onSubmit={handleSubmitForm}>
            <div onClick={() => {
                setShowConnect(false);
            }} className="absolute right-3 top-3 cursor-pointer text-3xl text-white/60">
                <IoIosClose />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-white/70" htmlFor="email">
                    Email Address
                </label>
                <input
                    className="mt-2 rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
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
            <div className="flex flex-col">
                <label className="text-sm text-white/70" htmlFor="name">
                    Name
                </label>
                <input
                    className="mt-2 rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                    id="name"
                    type="text"
                    name="name"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-white/70" htmlFor="message">
                    Message
                </label>
                <textarea
                    className="mt-2 min-h-[120px] rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                    id="message"
                    name="message"
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                />
            </div>
            <button className="mt-2 w-fit rounded-full bg-[#f7b955] px-4 py-2 text-sm font-semibold text-[#1a1206] transition hover:bg-[#f4a93b]" type="submit" disabled={state.submitting}>
                Submit
            </button>
        </form>
    );
}
