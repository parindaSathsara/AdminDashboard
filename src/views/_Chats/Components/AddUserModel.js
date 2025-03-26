import React, { useEffect, useState } from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton, CContainer, CRow, CCol, CFormInput } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './AddUserModel.css'
import { event } from 'jquery';
import axios from 'axios';
import Swal from 'sweetalert2';
import { serverTimestamp } from 'firebase/firestore';


const AddUserModel = (props) => {

  var baseURL = "https://gateway.aahaas.com/api";

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);


  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  }

  const searchUsers = (users) => {
    return users.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()));
  }

  const fetchUsers = async () => {

    try {
      axios.get(baseURL + '/getvendors').then(response => {
        if (response.status == 200) {
          const users = response.data.data;
          setUsers(users);
        }
      })
    }
    catch (error) {
      // console.log(error);
    }

  }
  //Add supplier to conversation
  const updateConversation = () => {

    if (!selectedUser) {
      return
    }
    const dataSet = props.conversation_data;

    dataSet.supplier_id = selectedUser.vendor_id;
    dataSet.supplier_name = selectedUser.username;
    dataSet.group_chat = true;
    dataSet.supplier_mail_id = selectedUser.email;
    dataSet.supplier_added_date = new Date();
    dataSet.supplier_removed_date = null;

    try {
      axios.post(baseURL + '/updatechat/' + props.conversation_data.chat_id, dataSet).then(res => {
        // console.log(res);
        if (res.data.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Supplier Added",
            showConfirmButton: false,
            timer: 1500
          });
          props.handleVisibility(false)
        } else {

        }
      })
    } catch (error) {
      // console.log(error);
      throw new Error(error)
    }
  }

  useEffect(() => {
    fetchUsers();
    // console.log(props.conversation_data);
    // setSelectedUser(props.conversation_data.supplier_id);
    // console.log(props.conversation_data.supplier_id);
    // handleSelectUser(props.conversation_data.supplier_id);
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
          <CModalTitle className='d-flex align-items-center'> <FontAwesomeIcon icon={faUserPlus} className='m-2' /> <div>Add Supplier to Chat</div></CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <CFormInput placeholder='Search users' onChange={(event) => handleSearch(event)} />
          </CContainer>
          <CContainer className='users-container p-2'>
            {searchUsers(users).map((user, index) => (
              <CRow key={index} className={`user ${(selectedUser && selectedUser.id == user.id) ? 'active-select_user' : ''}`} >
                <CCol className='d-flex align-items-center' onClick={() => handleSelectUser(user)}>
                  {user.username + "(" + user.email + ")"}
                </CCol>
              </CRow>
            ))}
          </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={updateConversation}>Add</CButton>
        </CModalFooter>
      </CModal>
    </div >
  )
}

export default AddUserModel
