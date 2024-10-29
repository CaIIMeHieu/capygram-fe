import { AppContext } from '@/context/AppProvider'
import { Button } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function RequireLogin() {
  const { setIsLoading } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect( () => {
    setIsLoading(false);
  },[] )
  return (
    <div style={{
        position:'absolute' ,
        width:'84%',
        left:'180px',
        height:'100vh' ,
        display:'flex' , 
        justifyContent:'center',
        alignItems:'center'
    }}>
     <div style={{ display: 'flex',marginTop:'-30px', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '903px', display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: '200px', width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img style={{
            height:'100%',
            width:'100%'
        }} src="/src/assets/images/logoCapyGram.png" alt=""/>
        </div>
        <div style={{ flexGrow: 1 }}>
          <div style={{ fontWeight: 'bold',margin:'0 0 20px 0', fontSize: '28px' ,textAlign:'center' }}>Đăng nhập vào Capygram</div>
          <div style={{ fontSize: '20px' ,margin:'20px 0', textAlign:'center' }}>
            Hãy đăng nhập để xem ảnh, video của bạn bè và khám phá các tài khoản khác mà bạn sẽ yêu thích.
          </div>
        </div>
        <div style={{display:'flex'}}>
              <Button type='primary' size='large' onClick={() => navigate("/ft/register") }>Đăng ký</Button>
              <Button style={{marginLeft:'10px'}} size='large' onClick={() => navigate("/ft/login") } >Đăng nhập</Button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default RequireLogin