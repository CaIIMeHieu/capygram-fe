/* eslint-disable */
import React, { useState, useEffect } from 'react'
import "./Login.scss"
import { ErrorMessage, Field, Form, Formik } from 'formik';
import img from "../../assets/images/image.png"
import logoCapyGram from "../../assets/images/logoCapyGram.png"
import { useNavigate } from 'react-router-dom';
import img2 from "../../assets/images/Screenshot 2024-06-13 164302.png"
import img3 from "../../assets/images/Screenshot 2024-06-13 164310.png"
import '@/i18n';
import { useTranslation } from 'react-i18next';
import { getUserById, login } from '@/api/authApi/auth';
import { useDispatch } from 'react-redux';
// import { setUser } from '@/store/formSlice';
import { toast } from 'react-toastify';
import { setUser } from '@/store/userSlice';


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [img, img2, img3];
  const { t } = useTranslation('login');
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);


    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='login'>
      <div className="login-container">
        <div className="image">
          <ul className='slide'>
            {images.map((image, index) => (
              <li key={index} className={index === currentImageIndex ? 'active' : ''}>
                <div className="content-img">
                  <img  src={image} alt={`Slide ${index}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="content-form">
          <div className="form">
            <Formik
              initialValues={{
                username: '',
                password: ''
              }}
              onSubmit={async (values) => {
                try {
                  await login(values);

                  const userId = localStorage.getItem('userId');
                  const me = await getUserById(userId);
                  dispatch(setUser({
                    id: me.id,
                    email: me.email,
                    fullname: me.profile.fullName,
                    username: me.userName,
                    avatarUrl: me.profile.avatarUrl
                  }));

                  navigate("/");
                  toast.success('Đăng nhập thành công')
                }
                catch (errors) {
                  console.error(errors);
                  toast.error('Đăng nhập không thành công. Vui lòng thử lại');
                }
              }}
            >
              {({ handleSubmit, isSubmitting, touched, errors }) => (
                <Form onSubmit={handleSubmit} className='Form' >
                  <img style={{cursor:'pointer'}} onClick={() => navigate("/")} src={logoCapyGram} alt="" />
                  <div className="form-input">
                    <Field className='field' name='username' type='text' placeholder={t("placeholder")} />
                  </div>
                  <div className="form-input">
                    <Field className='field' name='password' type={showPassword ? 'text' : 'password'} placeholder={t("password")} />
                    <i className={`eye-icon ${showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'}`} onClick={togglePasswordVisibility}></i>
                  </div>
                  <button className='form-button' type='submit'><b>{t('login')}</b></button>
                  <p onClick={() => navigate("/ft/reset-password")}>{t('resetpassword')}</p>
                </Form>
              )}
            </Formik>
          </div>
          <div className="register">
            <p onClick={() => navigate("/ft/register")}>{t('register')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;