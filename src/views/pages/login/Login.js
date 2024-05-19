import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFooter,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CLink,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'


import logo from '../../../assets/brand/logo.png'
import AuthUser from 'src/service/authenticator'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Carousel } from 'react-bootstrap'

import "./Login.css"
import { UserLoginContext } from 'src/Context/UserLoginContext'

import clip from '../../../assets/travelVid.mp4'; 



const Login = () => {

  const navigate = useNavigate();

  const { http_call, setToken } = AuthUser();

  const [loginInput, setLoginInput] = useState({
    email: '',
    password: ''
  });





  const { userLogin, setUserLogin, userData,setUserData } = useContext(UserLoginContext);


  const handleInputChange = (e) => {
    e.persist();

    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });

  }


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // const formdata = new FormData();
    // formdata.append('_token', csrfToken);
    // formdata.append('email', loginInput.username);
    // formdata.append('password', loginInput.password);

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');



    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    };

    // axios.get('/sanctum/csrf-cookie', { withCredentials: true }).then((response) => {h
    // console.log(formdata)

    console.log(csrfToken)
    console.log(loginInput)

    try {

      await axios.post('user_login', loginInput,
        {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        }
      ).then((res) => {

        console.log(res.data)
        if (res.data.status === 200) {

          setToken(res.data.user, res.data.access_token);

          console.log("Login Details is", res.data.user_data)

          setUserData(res.data.user_data)

          localStorage.setItem('user', JSON.stringify(res.data.user_data));
          localStorage.setItem('userID', res.data.user_id);
          localStorage.setItem('token', res.data.access_token);

          setUserLogin(true)
          navigate("/dashboard")

        }

        if (res.data.status === 403) {
          Swal.fire({
            title: "Login Failed",
            text: "Invalid username or password. Please try again.",
            icon: "error"
          });
        }
      }).catch((err) => {
        console.log(err, "Error is")
        // throw new Error(err);
      });


    } catch (error) {
      console.log(error)
    }
    // })
  }



  return (


    <div className='lifestylePage'>
      {/* Required meta tags */}

      <div className="d-lg-flex half">

      <div className="bg order-1 order-md-2" style={{ position: 'relative', overflow: 'hidden' }}>
      <video autoPlay muted loop style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
        <source src={clip} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Other content can go here */}
    </div>

        {/* <div className="bg order-1 order-md-2" style={{ backgroundImage: 'url("https://wallpapers.com/images/hd/sri-lanka-ancient-city-sigiriya-yl2a01gga8ogmfpu.jpg")' }} /> */}
        <div className="contents order-2 order-md-1">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7">

                <CImage src='https://gateway.aahaas.com/aahaas.png' width={130} className='pb-3'></CImage>


                <h3 style={{color:'white'}}>Login to <strong>Aahaas</strong></h3>
                <p className="mb-4">Elevate your administrative processes to new heights of productivity and effectiveness with Aahaas, your key to seamless management.</p>

                {/* <form action="#" method="post">
                  <div className="form-group first">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" placeholder="your-email@gmail.com" id="username" />
                  </div>
                  <div className="form-group last mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" placeholder="Your Password" id="password" />
                  </div>
                  <div className="d-flex mb-5 align-items-center">
                    <label className="control control--checkbox mb-0"><span className="caption">Remember me</span>
                      <input type="checkbox" defaultChecked="checked" />
                      <div className="control__indicator" />
                    </label>
                    <span className="ml-auto"><a href="#" className="forgot-pass">Forgot Password</a></span>
                  </div>
                  <input type="submit" defaultValue="Log In" className="btn btn-block btn-primary" />
                </form> */}


                <CForm>
                  <CInputGroup className="mb-3">

                    <CFormInput placeholder="Username" autoComplete="username" name='email' className="form-group first" onChange={handleInputChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-4">

                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name='password'
                      autoComplete="current-password"
                      onChange={handleInputChange}
                      className="form-group first"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs="12" md="6" className="mb-3 mb-md-0">
                      <CButton type='submit' className="w-100" style={{backgroundColor:'#DB3232',fontWeight:'500',fontSize:18, borderWidth:0}} onClick={handleFormSubmit}>
                        Login
                      </CButton>
                    </CCol>

                  </CRow>

                </CForm>

                <br></br>

                {/* <CLink color="primary" className="w-100" src=''>
                  Don't Have an account? Register !
                </CLink> */}


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <>


    //   <CRow className='vh-100'>
    //     <CCol className="p-4" md={4}>
    //       <CCardBody style={{ height: '100%' }}>
    //         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
    //           <img src={logo} width={100} alt="Logo" />
    //         </div>
    // <CForm>
    //   <h1 style={{ textAlign: 'center', fontSize: 28 }}>Login</h1>
    //   <p className="text-medium-emphasis" style={{ textAlign: 'center' }}>Sign In to your account</p>
    //   <CInputGroup className="mb-3">
    //     <CInputGroupText>
    //       <CIcon icon={cilUser} />
    //     </CInputGroupText>
    //     <CFormInput placeholder="Username" autoComplete="username" name='email' onChange={handleInputChange} />
    //   </CInputGroup>
    //   <CInputGroup className="mb-4">
    //     <CInputGroupText>
    //       <CIcon icon={cilLockLocked} />
    //     </CInputGroupText>
    //     <CFormInput
    //       type="password"
    //       placeholder="Password"
    //       name='password'
    //       autoComplete="current-password"
    //       onChange={handleInputChange}
    //     />
    //   </CInputGroup>
    //   <CRow>
    //     <CCol xs="12" md="6" className="mb-3 mb-md-0">
    //       <CButton type='submit' color="primary" className="w-100" onClick={handleFormSubmit}>
    //         Login
    //       </CButton>
    //     </CCol>
    //     <CCol xs="12" md="6">
    //       <Link to="/register">
    //         <CButton color="link" className="w-100">
    //           Don't Have an account? Register !
    //         </CButton>
    //       </Link>
    //     </CCol>
    //   </CRow>
    // </CForm>
    //       </CCardBody>
    //     </CCol>
    //     <CCol className="text-white bg-primary" md={8}>
    //       <CCardBody className="text-center">
    //         <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww" />
    //       </CCardBody>
    //     </CCol>
    //   </CRow>


    // </>
  )
}

export default Login
