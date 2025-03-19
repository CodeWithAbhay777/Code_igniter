import { useEffect } from "react";


export function useDebounceEffect(callback, dependencies, delay) {


    useEffect(() => {

        let saveTimeout;

        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(() => {
            callback();
        }, delay);

        return () => clearTimeout(saveTimeout);

    }, [...dependencies]);




}


