import {React , useRef } from 'react'
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, input, onChange ,style , readOnly}) => {

    const editorRef = useRef();
    

    const focusing = (e) => {
        editorRef.current = e;
        e.focus();
      }

    return (
        <div id='editing-area' className={`${style ? style : 'w-full h-full bg-gray-900 flex-grow p-[7px] rounded overflow-hidden flex-grow'}`}>

            {readOnly ? <Editor
                height="100%"
                theme="vs-dark"
                onMount={focusing}
                language={language}
                value={input}
                options={{
                    readOnly: true
                }}
            /> :
            <Editor
                height="100%"
                theme="vs-dark"
                onMount={focusing}
                language={language}
                value={input}
                onChange={onChange}
            />}
        </div>
    )
}

export default CodeEditor