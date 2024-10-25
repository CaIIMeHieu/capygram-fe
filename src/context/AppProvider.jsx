import React from 'react'

import { useState , createContext } from "react" ;

export const AppContext = createContext() ;


const AppProvider = ({children}) => {
  
  const [isLoading,setIsLoading] = useState(true) ;

    const value = {
        isLoading ,
        setIsLoading ,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider