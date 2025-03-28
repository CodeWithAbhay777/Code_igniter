import { React, useState } from 'react'
import Editor from '@monaco-editor/react';
import { RxCross2 } from "react-icons/rx";
import { BiLoaderAlt } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveCode } from '../util/saveCode_API';


const SaveModal = ({ codeSaveinfo, closeModal, setSavedRefresh }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [savebtnLoad, setSaveBtnLoad] = useState(false);

    const handleSubmit = async () => {
        if (title != "" && codeSaveinfo.languageValue && codeSaveinfo.inputValue != "") {

            if (!savebtnLoad) setSaveBtnLoad(true);

            const response = await saveCode(codeSaveinfo.languageValue, codeSaveinfo.inputValue, title, description);

            if (response) {
                setSaveBtnLoad(false);
                setSavedRefresh((prev) => !prev);
                toast.success("Code saved successfully");
                closeModal();
            }
            else {
                toast.success("Something went wrong");
            }


        }
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[100]'>

            <div className='h-[26rem] w-[70rem] lg:w-[50rem] md:w-[28rem] sm:w-[24rem] bg-gray-900 rounded-lg shadow-[0px_0px_50px_rgba(0,0,0,1)] flex'>
                <div className='h-full w-[22rem] flex flex-col'>
                    <div className='w-full my-1 py-1 px-5 text-2xl my-2 text-white flex justify-between items-center'>
                        <h1 >Save code</h1>
                        <RxCross2 className='text-2xl hover:text-red-500 cursor-pointer' onClick={closeModal} />
                    </div>
                    <div id="input-area" className=' flex-grow px-6 py-2'>


                        <h2 className='text-lg my-2 text-white'>title</h2>

                        <input id='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" className='h-[2.5rem] w-full m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)]' />

                        <h2 className='text-lg my-2 text-white'>add note</h2>

                        <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="optional" className='h-[7.5rem] w-full resize-none m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit' />

                        <button onClick={handleSubmit} className='h-[3rem] w-full bg-black hover:bg-gray-950 text-white text-xl rounded-md my-5 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] flex items-center justify-center'><FaSave className='text-2xl mx-2' />{savebtnLoad ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : "Submit and save"}</button>





                    </div>

                </div>
                <div className='flex-grow h-full rounded-r-lg p-3'>
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        // onMount={focusing}
                        language={codeSaveinfo.languageValue}
                        value={codeSaveinfo.inputValue}
                        options={{
                            readOnly: true
                        }}
                    />;
                </div>

            </div>
        </div>
    )
}

export default SaveModal