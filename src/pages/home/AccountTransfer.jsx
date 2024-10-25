/* eslint-disable react/prop-types */
import './AccountTransfer.scss'
import avt from '../../assets/images/account.png'
import Login2 from './Login2'
import { useState } from 'react'
import { motion } from 'framer-motion';

const AccountTransfer = ({ oncancel }) => {
    const [showLogin2, setShowLogin2] = useState(true);
    //const user = useSelector((state) => state.user);

    const handleShowlogin2 = () => {
        setShowLogin2(true);
    }
    const cancelLogin2 = () => {
        setShowLogin2(false);
    }
    return showLogin2 && 
    <motion.div
        className='note-container'
        onClick={(e) => e.stopPropagation()}
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
    >
        <Login2 oncancel={cancelLogin2} />
    </motion.div>
}
export default AccountTransfer;