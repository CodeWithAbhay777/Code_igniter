import React, { useRef, useState } from 'react';
import { languageSupport } from '../util/language_support';
import CodeEditor from './CodeEditor';
import { RxCross1 } from "react-icons/rx";
import Selectlanguage from './Selectlanguage';
import { BiLoaderAlt } from "react-icons/bi";
import { executeCode } from '../util/piston_API';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { editCodeSumbit } from '../util/editCode_API';

import { MdEdit } from "react-icons/md";

const EditWindow = ({ setEditWindowState, savedData, setSavedRefresh }) => {


    const [editInput, setEditInput] = useState(savedData.newInputValue);
    const [editTitleValue, setEditTitleValue] = useState(savedData.newTitle);
    const [editNoteValue, setEditNoteValue] = useState(savedData.newNote);
    const [editBtnLoad, setEditBtnLoad] = useState(false);
    const [editLangValue, setEditLangValue] = useState(savedData.newLangValue);
    const [editOutput, setEditOutput] = useState([`Click "Run" to see the output here`])
    const editIsError = useRef(false);
    const [editResetBtrClr, setEditResetBtnClr] = useState(false);
    const [editSumbmitBtnLoad, setEditSubmitBtnLoad] = useState(false);

    const submitEditCode = async () => {
        if (editTitleValue !== "" && editNoteValue !== "" && editInput !== "") {
            setEditSubmitBtnLoad(true);
            const response = await editCodeSumbit(editLangValue, editInput, editTitleValue, editNoteValue, savedData.id, savedData.ownerId);

            if (response) {
                toast.success("Edited successfully")
                setSavedRefresh((prev) => !prev);
                setEditWindowState(false);


            }
            else {
                toast.error("Something went wrong : try again later")
            }

            setEditSubmitBtnLoad(false);
        }
    }


    const getOutput = async (e) => {

        if (editInput === "") return;

        setEditBtnLoad(true);
        try {

            const data = await executeCode(editLangValue, editInput);
            editIsError.current = data.run.stderr === "" ? false : true;
            if (data.run.signal) {
                if (data.run.signal === 'SIGKILL') {
                    toast.error('Load exeeded: please decrease the values')
                }
            }
            data.run.output.split('\n');
            setEditOutput([...data.run.output.split('\n'), "-------code-execution-completed-------"]);


        } catch (error) {
           
            toast.error("Something went wrong!");

        }
        finally {
            setEditBtnLoad(false)
            setEditResetBtnClr(true)
        }

    }


    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[100] p-2 lg:px-16 lg:py-8'>
            <div className='h-full w-full bg-black rounded-lg p-1 shadow-[0px_0px_50px_rgba(0,0,0,1)] flex items-center justify-between flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-hidden'>
                <div className=' h-auto lg:h-full w-full lg:w-[75%] p-2 flex flex-col'>
                    <div className='bg-gray-900 w-full h-auto sm:h-[4rem] rounded-lg flex flex-wrap items-center justify-between p-2'>
                        <div className=' h-fit flex items-center flex-wrap gap-1 sm:gap-3 sm:h-full' >
                            <Selectlanguage language={editLangValue} newVal={setEditLangValue} />

                            <button className='h-[2.2rem] w-[4rem] sm:h-[2.5rem] sm:w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-700 cursor-pointer' onClick={getOutput}>
                                {editBtnLoad ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : "Run"}
                            </button>

                            <button
                                onClick={() => {
                                    editIsError.current = false;
                                    setEditOutput([`Click "Run" to see the output here`]);

                                    setEditResetBtnClr(false);
                                }
                                }
                                className='h-[2.2rem] w-[4rem] sm:h-[2.5rem] sm:w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-700 cursor-pointer' >Clear
                            </button>
                        </div>
                        <div onClick={() => setEditWindowState(false)} className='h-[2.5rem] w-[3rem] cursor-pointer flex items-center justify-center bg-red-600 rounded hover:bg-red-500'>
                        <RxCross1 className='text-white text-lg cursor-pointer '  />
                        </div>
                        
                    </div>

                    <div className=' h-[70rem] lg:max-h-[92%] w-full flex-grow flex flex-col lg:flex-row items-center justify-between p-2 '>
                        <div className='h-full w-full lg:w-1/2 lg:h-full'>
                            <CodeEditor language={savedData.newLangValue} input={savedData.newInputValue} onChange={(e) => setEditInput(e)} />
                        </div>

                        <div className={`h-full w-full lg:w-[49%] lg:h-full bg-gray-900 rounded-lg p-4 overflow-auto break-words text-gray-300 mt-2 lg:mt-0 ${editIsError.current ? `text-red-500 border border-red-500` : `text-gray-300 border border-green-300`} ${!editResetBtrClr ? `border-0 text-gray-300` : null}`}>
                            {editOutput.map((val, i) => {
                                return <p key={i}>{val}</p>
                            })}
                        </div>
                    </div>
                </div>
                <div className='h-full w-full lg:w-[25%] p-2'>
                    <div className='h-full w-full flex flex-col items-center gap-2'>
                        <div className='bg-gray-900  w-full flex items-center h-[4rem] px-3 rounded-lg '>
                            <h1 className='text-white text-2xl font-semibold'>Edit Code</h1>
                        </div>

                        <div id="input-area" className=' flex-grow w-full'>


                            <h2 className='text-lg my-2 text-white'>title</h2>

                            <input id='title' value={editTitleValue} onChange={(e) => setEditTitleValue(e.target.value)} className='h-[2.5rem] w-full m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)]' />

                            <h2 className='text-lg my-2 text-white'>add note</h2>

                            <textarea id='description' value={editNoteValue} onChange={(e) => setEditNoteValue(e.target.value)} placeholder="optional" className='h-[16rem] w-full resize-none m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit' />



                            <button onClick={submitEditCode} className={`h-[3rem] w-full ${editSumbmitBtnLoad ? 'pointer-events-none opacity-50' : null} bg-green-600 hover:bg-green-500 text-white text-xl rounded-md my-5 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] flex items-center justify-center`}><MdEdit className='text-2xl mx-2' />{editSumbmitBtnLoad ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : "Submit and save"}</button>



                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default EditWindow