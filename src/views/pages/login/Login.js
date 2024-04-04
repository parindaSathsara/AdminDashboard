import React, { useState } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'


import logo from '../../../assets/brand/logo.png'
import AuthUser from 'src/service/authenticator'
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate();

  const { http_call, setToken } = AuthUser();

  const [loginInput, setLoginInput] = useState({
    email: '',
    password: ''
  });

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

    // axios.get('/sanctum/csrf-cookie', { withCredentials: true }).then((response) => {
    // console.log(formdata)

    console.log(csrfToken)
    console.log(loginInput)

    try {

      await axios.post('http://192.168.1.4:8000/api/user_login', loginInput,
        {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        }
      ).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
          setToken(res.data.user, res.data.access_token);
          localStorage.setItem('user',res.data.user);
          localStorage.setItem('token',res.data.access_token);
          navigate('/dashboard')
        }
        if (res.data.status === 401) {
          // toast.error('Unauthorized User | Please check the credentials again!', {
          //     style: {
          //         background: '#333',
          //         color: '#fff',
          //     }
          // })
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
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>


          <CRow className="justify-content-center">
            <CCol md={6}>
              <CCardGroup>

                <CCard className="p-4">
                  <CCardBody>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                      <img src={logo} width={100} alt="Logo" />
                    </div>

                    <CForm>
                      <h1 style={{ textAlign: 'center', fontSize: 28 }}>Login</h1>
                      <p className="text-medium-emphasis" style={{ textAlign: 'center' }}>Sign In to your account</p>
                      {/* <form className="row" onSubmit={handleFormSubmit}> */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" autoComplete="username" name='email' onChange={handleInputChange} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          name='password'
                          autoComplete="current-password"
                          onChange={handleInputChange}
                        />
                      </CInputGroup>

                      <CRow>

                        <CButton type='submit' color="primary" className="px-4" onClick={handleFormSubmit}>
                          Login
                        </CButton>

                        {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}


                      </CRow>
                      {/* </form> */}
                    </CForm>
                  </CCardBody>
                </CCard>

                <div className="text-white  loginCard" style={{ width: '40%' }}>

                  {/* <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div> */}

                </div>

              </CCardGroup>
            </CCol>
          </CRow>

        </CContainer>


      </div>

      <CFooter>
        <small className="text-muted hint__Text">
          Please contact Admin if forgot the password to login
        </small>
        <hr className='hr__' />
        <small>&copy;2023 Apple Techlabs</small>
      </CFooter>

    </>
  )
}

export default Login
