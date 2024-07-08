import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = () => {

    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Include CSRF token in the request headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    };
    axios.post('create_admin_user', {
        name: username,
        email: email,
        password: password,
        role: role,
    }, { headers: headers })
      .then(response => {

        Swal.fire({
          title: "Success: Account Created",
          text: "Your account has been created successfully!",
          icon: "success"
        });

        navigate('/login'); // Redirect to login page
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          title: "Account Creation Failed",
          text: "Invalid username or password. Please try again.",
          icon: "error"
        });

      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={repeatPassword}
                      onChange={e => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {/* Role selection dropdown */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <select
                      className="form-select"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="accountant">Accountant</option>
                      <option value="supplier">Supplier</option>
                      <option value="booking">Booking</option>
                    </select>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleRegister}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default Register;
