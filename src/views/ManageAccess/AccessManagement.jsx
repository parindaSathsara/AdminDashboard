import React, { useContext, useEffect, useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import {getAllEmployees, assignPermissionToEmp, getAllPositions, getPermissionByRole} from './service/service';
import Select from 'react-select';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import Swal from "sweetalert2";

const AccessManagement = () => {
  const { userData } = useContext(UserLoginContext);
  // useEffect(() => {
  //   if (userData?.user_role !== 'super_admin') {
  //     Swal.fire({
  //       title: "Permission Denied",
  //       text: "You do not have permission to access this page",
  //       icon: "warning",
  //       timer: 2000,
  //   });
  //     window.location = '/dashboard';
  //   }

  // }, [userData]);

  // User roles
  const roles = ['Manager', 'Team Leader', 'priority ', 'Emp2', 'Emp3'];

  const dashBoardPermissions = {
    "name": "Dashboard & Orders",
    "permissions": [
      "View assign employee order",
      "Delete assign employee order",
      "Assign new employee order",
      "Change booking order status",
      "Reach supplier",
      "Resend supplier voucher",
      "View traveler pnl",
      "Submit traveler request",
      "Driver allocate",
      "View account pnl",
      "Download order long itinerary",
      "Download order short itinerary",
      
    ],
    "values": [
      "view assign employee order",
      "delete assign employee order",
      "assign new employee order",
      "change booking order status",
      "reach supplier",
      "resend supplier voucher",
      "view traveler pnl",
      "submit traveler request",
      "driver allocate",
      "view account pnl",
      "download order long itinerary",
      "download order short itinerary",
     
    ]
  }

  const vendorsPermissions = {
    "name": "Vendors",
    "permissions": [
      "View vendor document",
      "Approve vendor document",
      "Reject vendor document",
     
    ],
    "values": [
      "view vendor document",
      "approve vendor document",
      "reject vendor document",
     
    ]
  }

  const accountsPermissions = {
    "name": "Accounts",
    "permissions": [
      "All accounts access",
      "View customer orders",
      "Approve customer orders",
      "Reject customer orders",
      "View customer order pnl",
      "Download account order long itinerary",
      "Download account order short itinerary",
      "View refund customer Request",
      "Confirm refund customer Request",
    ],
    "values": [
      "all accounts access",
      "view customer orders",
      "approve customer orders",
      "reject customer orders",
      "view customer order pnl",
      "download account order long itinerary",
      "download account order short itinerary",
      "view refund customer request",
      "confirm refund customer request",
     
    ]
  }

  const chatsPermissions = {
    "name": "Chat",
    "permissions": [
    //  "View assigned chats",
     "View assign employer chat",
     "Remove employer from chat",
     "Assign employer to chat",
    ],
    "values": [
      // "view assigned chats",
     "view assign employer chat",
     "remove employer from chat",
     "assign employer to chat",
     
    ]
  } 

  const reportPermissions = {
    "name": "Report",
    "permissions": [
     "Generate all report",
     "Generate account report",
    ],
    "values": [
      "generate all report",
      "generate account report",
    ]
  } 

  const emailPermissions = {
    "name": "Email",
    "permissions": [
     "Email resend",
     "Download order receipt",
     "Generate Emails",
    ],
    "values": [
      "email resend",
     "download order receipt",
     "generate email",
     
    ]
  } 

  

  // State for selected user, role, and permissions
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Handle checkbox change
  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission) // Remove if already selected
        : [...prev, permission] // Add if not selected
    );
  };

  // Submit form
  const handleSubmit = async () => {
    if(!selectedEmployee?.value || !selectedRole){
      Swal.fire({
        icon: 'error',
        title: 'Fill all fields',
        text: 'Please fill all fields before submitting',
    });
    return
    }
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to assign these permissions?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
  });

  if (confirmation.isConfirmed) {
     try{

      const data ={
        userId : selectedEmployee?.value,
        role: selectedRole,
        permissions: selectedPermissions
    }
    console.log("Data", data, selectedRole,selectedPermissions);
    const result = await assignPermissionToEmp(data);
    console.log("Result: ", result);
    if(result[0] !== 200){
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error assigning permissions',
    });
  }else{
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Permissions assigned successfully',
    });
    // console.log("Data: ", data);
    setSelectedEmployee(null);
    setSelectedRole('');
    setSelectedPermissions([]);
    monitorAvailability();
    
     }
    }catch(error){
      console.error("Error available employee: ", error);
  }
  }
  
  };

  const [allUsers, setAllUser] = useState([]);

  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const employeeOptions = availableEmployees.map((response) => ({
      value: response.id,
      email: response.email,
      label: response.name + ' (' + response.email + ')',
      role: response?.roles[0],
      permissions: response?.permissions || [], 
  }));
  console.log("Available Employees: ", employeeOptions);

  const monitorAvailability = () => {
      try{
          getAllEmployees().then(response => {
              setAvailableEmployees(response);
          }).catch(error => {
              console.error("Error fetching available employees: ", error);
          });
      }catch(error){
          console.error("Error available employee: ", error);
      }
  };

  const [allPositions, setAllPositions] = useState([]);
  const positionsOptions = allPositions;
  console.log("Positions: ", positionsOptions);
  const getPositions = () => {
    try{

      getAllPositions().then(response => {
        setAllPositions(response);
          //   console.log("Available Employees: ", response);
        }).catch(error => {
            console.error("Error fetching available employees: ", error);
        });
    

    }catch(error){
        console.error("Error available employee: ", error);
    }
};

  useEffect (()=>{
      monitorAvailability();
      getPositions();
  },[])

  const getPermissions = (role) => {
    try{
      console.log("Role", role)
      if(role === ''){}
      getPermissionByRole(role).then(response => {
        // console.log("Permissions: ", response);
        setSelectedPermissions(response[1]);
        }).catch(error => {
          setSelectedPermissions(response[1]);
            console.error("Error fetching available employees: ", error);
        });
    }catch(error){
        console.error("Error available employee: ", error);
    }
};

  useEffect(() => {
    setSelectedRole(selectedEmployee?.role !== undefined ? selectedEmployee?.role : '');
    setSelectedPermissions(selectedEmployee?.permissions || []);

  }, [selectedEmployee,]);

  return (
    <CContainer fluid>
      <CRow className="justify-content-center">
        <CCol xl={12} lg={12}>
          <CCard className="shadow-sm">
            <CCardHeader className="bg-secondary text-white">
              <h4 className="mb-0">Access Management</h4>
            </CCardHeader>
            <CCardBody>
              <CForm>
                {/* Select User and Role */}
                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormLabel htmlFor="userSelect">Select User</CFormLabel>
                    <Select
                        isSearchable={true}
                        options={employeeOptions}
                        value={selectedEmployee}
                        onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="roleSelect">Select Role</CFormLabel>
                    <CFormSelect
                      id="roleSelect"
                      value={selectedRole}
                      // options={positionsOptions}
                      isSearchable={true}
                      onChange={(e) => {
                        setSelectedRole(e.target.value)
                        getPermissions(e.target.value)
                      }}
                    >
                      <option value="">Select Role</option>
                      {positionsOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </CFormSelect>
                    {/* <Select
                        isSearchable={true}
                        options={positionsOptions}
                        value={selectedEmployee}
                        onChange={(selectedOption) => setSelectedRole(selectedOption)}
                    /> */}
                  </CCol>
                </CRow>

                {/* Permissions Section */}
                {/* <CRow className="mb-4">
                  <CCol>
                    <CFormLabel>Permissions</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {permissionsList.map((permission) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={permission}
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow> */}

                <CRow className="mb-4">
                  <CCol>
                    <CFormLabel style={{ fontWeight: 'bold' }}>{dashBoardPermissions.name}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {dashBoardPermissions.permissions.map((permission, index) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={dashBoardPermissions.values[index]}
                          checked={selectedPermissions.includes(dashBoardPermissions.values[index])}
                          onChange={() => handlePermissionChange(dashBoardPermissions.values[index])}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mb-4">
  <CCol>
    <CFormLabel style={{ fontWeight: 'bold' }}>{vendorsPermissions.name}</CFormLabel>
    <div className="d-flex flex-wrap gap-3">
      {vendorsPermissions.permissions.map((permission, index) => (
        <CFormCheck
          key={permission}
          id={permission}
          label={permission}
          value={vendorsPermissions.values[index]} // Map to corresponding value
          checked={selectedPermissions.includes(vendorsPermissions.values[index])}
          onChange={() => handlePermissionChange(vendorsPermissions.values[index])}
        />
      ))}
    </div>
  </CCol>
</CRow>
                <CRow className="mb-4">
                  <CCol>
                    <CFormLabel style={{ fontWeight: 'bold' }}>{accountsPermissions.name}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {accountsPermissions.permissions.map((permission, index) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={accountsPermissions.values[index]}
                          checked={selectedPermissions.includes(accountsPermissions.values[index])}
                          onChange={() => handlePermissionChange(accountsPermissions.values[index])}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mb-4">
                  <CCol>
                    <CFormLabel style={{ fontWeight: 'bold' }}>{chatsPermissions.name}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {chatsPermissions.permissions.map((permission, index) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={chatsPermissions.values[index]}
                          checked={selectedPermissions.includes(chatsPermissions.values[index])}
                          onChange={() => handlePermissionChange(chatsPermissions.values[index])}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mb-4">
                  <CCol>
                    <CFormLabel style={{ fontWeight: 'bold' }}>{reportPermissions.name}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {reportPermissions.permissions.map((permission, index) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={reportPermissions.values[index]}
                          checked={selectedPermissions.includes(reportPermissions.values[index])}
                          onChange={() => handlePermissionChange(reportPermissions.values[index])}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mb-4">
                  <CCol>
                    <CFormLabel style={{ fontWeight: 'bold' }}>{emailPermissions.name}</CFormLabel>
                    <div className="d-flex flex-wrap gap-3">
                      {emailPermissions.permissions.map((permission, index) => (
                        <CFormCheck
                          key={permission}
                          id={permission}
                          label={permission}
                          value={emailPermissions.values[index]}
                          checked={selectedPermissions.includes(emailPermissions.values[index])}
                          onChange={() => handlePermissionChange(emailPermissions.values[index])}
                        />
                      ))}
                    </div>
                  </CCol>
                </CRow>

                {/* Submit Button */}
                <CRow>
                  <CCol className="text-left">
                    <CButton style={{color:"white"}} color="info" size="lg" onClick={handleSubmit}>
                      Update Access
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AccessManagement;
