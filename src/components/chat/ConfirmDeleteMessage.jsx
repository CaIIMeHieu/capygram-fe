/* eslint-disable */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import '@/i18n';

import exit from '@/assets/images/exit.png';

import "./ConfirmDeleteMessage.scss";

const ConfirmDeleteMessage = ({ onCancel, message, deleteMessage }) => {
  const { t } = useTranslation('messages');
  const [selected, setSelected] = useState("everyone");

  const handleDelete = () => {
    if (selected === 'everyone') {
      deleteMessage(message, "deleteForEveryOne", message.type === 'sent');
      onCancel();
    }
    if (selected === 'you') {
      deleteMessage(message, "deleteForYourSelf", message.type === 'sent');
      onCancel();
    }
  };


  return (
    <div className='body_confirm-delete'>
      <div className='top-confirm'>
        <div></div>
        <div><b>{t('who')}</b></div>
        <div className='icon-top'><img style={{ cursor: 'pointer' }} src={exit} alt='close' onClick={onCancel} /></div>
      </div>

      <div className='center-confirm' style={{height:'fit-content'}}>
        <div className='center-item'>
          <div className='btn-select' onClick={() => setSelected('everyone')}>
            <div
              className={selected === 'everyone' ? 'selected' : ''}
            >
            </div>
          </div>
          <div className='p-content'>
            <p style={{ cursor: 'pointer' }}><b>{t('everyone')}</b></p>
            <p style={{ cursor: 'pointer' }} className='note'>{t('note1')}</p>
          </div>
        </div>
        <div className='center-item'>
          <div className='btn-select' onClick={() => setSelected('you')}>
            <div
              className={selected === 'you' ? 'selected' : ''}
            ></div>
          </div>
          <div className='p-content'>
            <p style={{ cursor: 'pointer' }}><b>{t('you')}</b></p>
            <p style={{ cursor: 'pointer' }} className='note'>{t('note2')}</p>
          </div>
        </div>
      </div>

      <div className='bottom-confirm'>
        <button style={{ cursor: 'pointer' }} className='cancel'><p className='p-bottom'><b>{t('cancel')}</b></p></button>
        <button style={{ cursor: 'pointer' }} className='recall' onClick={handleDelete}><b>{t('recall')}</b></button>
      </div>
    </div>
  )
}

export default ConfirmDeleteMessage;