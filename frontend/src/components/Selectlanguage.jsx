import React from 'react'
import { languageSupport } from '../util/language_support'

const Selectlanguage = ({language , newVal}) => {
    return (
        <select name="languages" id="languages" value={language}
            onChange={(val) => {

                newVal(val.target.value)

            }
            }
            className='bg-gray-800 h-[2.5rem] w-[12rem] rounded-md text-white p-1 hover:bg-gray-900 cursor-pointer'>
            {languageSupport.map((val, i) => {
                return <option key={i} value={val.language} >{val.language}&nbsp;&nbsp;&nbsp;{val.version}</option>
            })}
        </select>
    )
}

export default Selectlanguage