import React, { useEffect, useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CContainer, CRow, CCol, CFormInput } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './AddUserModel.css'
import { event } from 'jquery';
import axios from 'axios';


const AddUserModel = (props) => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);


  const handleSelectUser = (user) => {
    setSelectedUser(user)
    console.log(selectedUser);
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  }

  const searchUsers = (users) => {
    return users.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()));
  }

  const fetchUsers = async () => {
    var baseURL = "https://gateway.aahaas.com/api";

    try {
      axios.get(baseURL + '/getvendors').then(response => {
        if (response.status == 200) {
          const users = response.data.data;
          setUsers(users);
          // console.log(users);
        }
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
    // setSelectedUser(props.conversation_data.supplier_id);
    console.log(props.conversation_data.supplier_id);
    handleSelectUser(props.conversation_data.supplier_id);
    // console.log(selectedUser);

  }, [props.conversation_data])

  return (
    <div>
      <CModal
        visible={props.visibility}
        onClose={() => props.handleVisibility(false)}
        size='lg'
      >
        <CModalHeader onClose={() => props.handleVisibility(false)} className='message-details-model'>
          <CModalTitle className='d-flex align-items-center'> <FontAwesomeIcon icon={faUserPlus} className='m-2' /> <div>Add User to Chat</div></CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <CFormInput placeholder='Search users' onChange={(event) => handleSearch(event)} />
          </CContainer>
          <CContainer className='users-container p-2'>
            {searchUsers(users).map((user, index) => (
              <CRow key={index} className={`user ${(selectedUser && selectedUser == user.id) ? 'active-select_user' : ''}`} >
                <CCol className='d-flex align-items-center' onClick={() => handleSelectUser(user.id)}>
                  {user.username + "(" + user.email + ")"}
                </CCol>
              </CRow>
            ))}
          </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary">Add</CButton>
        </CModalFooter>
      </CModal>
    </div >
  )
}

export default AddUserModel
