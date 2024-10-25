/* eslint-disable */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import Note from '@/pages/profile/Note';
import SwitchAccount from './SwitchAccount';

import down from '@/assets/images/down.png';
import edit from '@/assets/images/edit.png';
import mess from '@/assets/images/mess.png';
import account from '@/assets/images/account.png';

import './Contacts.scss';

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  const { t } = useTranslation('messages');

  const note = useSelector((state) => state.form.note);

  const changeCurrentChat = (contact, index) => {
    setCurrentSelected(index);
    changeChat(contact, index);
  }

  const handleCancel = () => {
    setShowNoteForm(false);
  };

  const handleCancelSwitch = () => {
    setShowSwitchAccount(false);
  };

  return (
    <>
      {currentUser && (
        <div className='body-contacts'>
          <div className='contacts-container'>
            <div className='isOnline'>
              <div className='current-user'>
                <div className='top-current-user'>
                  <div className='current-name'>
                    <p style={{ cursor: 'pointer' }}><b>{currentUser.fullname}</b></p>
                    <img style={{ cursor: 'pointer' }} src={down} alt='down' onClick={() => setShowSwitchAccount(true)} />
                  </div>
                  <img style={{ cursor: 'pointer' }} src={edit} alt='editAccount' />
                </div>
                <div className='current-avatar'>
                  <div className='avatar'>
                    <img style={{ cursor: 'pointer' }} src={currentUser.avatarUrl !== ('string' && '') ? currentUser.avatarUrl : account} alt='avatar' />
                    <p style={{ cursor: 'pointer' }}>{t('yourNote')}</p>
                  </div>
                  <div className='note'>
                    <div style={{ cursor: 'pointer' }} className='content-note' onClick={() => setShowNoteForm(true)}>{note.describe === '' ? t('note') : note.describe}</div>
                    <div style={{ cursor: 'pointer' }} className='cham-to'></div>
                  </div>
                </div>
              </div>
            </div>
            <div className='title'>
              <p className='p1'><b>{t('messages')}</b></p>
              <p style={{ cursor: 'pointer' }} className='p2'>{t('request')}</p>
              <img src={mess} alt='mess' />
            </div>
            <div className='contacts'>
              {contacts.map((contact, index) => {
                console.log(contact)
                return (<div
                  className={`contact ${currentSelected === index ? 'selected' : ''}`}
                  key={index}
                  onClick={() => { changeCurrentChat(contact, index) }}
                >
                  <div className='contact-avatar'>
                    <img style={{ cursor: 'pointer' }} src={contact.avatarUrl !== ('string' && '') ? contact.avatarUrl : account} alt='avatar' />
                  </div>
                  <div className='contact-info'>
                    <p style={{ cursor: 'pointer' }}>{contact.fullname}</p>
                  </div>
                </div>
                )
              })}
            </div>
          </div>

          {showNoteForm && (
            <div className='overlay' onClick={handleCancel}>
              <motion.div
                className='note-container'
                onClick={(e) => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <Note onCancel={handleCancel} />
              </motion.div>
            </div>
          )}


          {showSwitchAccount && (
            <div className='overlay' onClick={handleCancelSwitch}>
              <motion.div
                className='note-container'
                onClick={(e) => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <SwitchAccount onCancel={handleCancelSwitch} currentUser={currentUser} />
              </motion.div>
            </div>
          )}

        </div>
      )}
    </>
  )
}

export default Contacts;