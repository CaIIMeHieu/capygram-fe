import React ,{ useEffect , useContext } from 'react'
import NProgress from 'nprogress'
import { AppContext } from '@/context/AppProvider';

const ProgressBar = () => {
  
  const { isLoading } = useContext(AppContext) ;  

  const handleStartProgressBar = () => {
    NProgress.start()
  }

  const handleDoneProgressBar = () => {
    NProgress.done()
  }

  useEffect( () => {
    isLoading ? handleStartProgressBar() : handleDoneProgressBar() ;
  },[isLoading] )

  return null;
}

export default ProgressBar