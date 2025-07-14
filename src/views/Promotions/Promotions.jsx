import React, { useState, useEffect, useCallback } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CForm,
  CSpinner,
  CFormSelect,
  CFormLabel,
  CImage,
} from '@coreui/react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  LinearProgress,
  Autocomplete,
  Chip,
  MenuItem,
  Popper 
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BellFill, Send } from 'react-bootstrap-icons';
import debounce from 'lodash/debounce';

const stackScreenData = {
  navigators: [
    {
      name: 'HomeNavigator',
      screens: [''],
    },
    {
      name: 'LoginNavigator',
      screens: [
        'LoginMainPage',
        'LoginPage',
        'SignInUsingPassword',
        'MobileLogin',
        'OneTimePass',
        'MobileNumberLogin',
        'ForgotPassword',
        'VerifyCodeAndResetPass',
        'ProfileLogin',
        'OnboardingScreen',
      ],
    },
    {
      name: 'MessageNavigator',
      screens: ['CustomerChatMain', 'ChatPage'],
    },
    {
      name: 'MainNavigatorStack',
      screens: [
        'Home',
        'Order Edit',
        'WebXMainPortal',
        'Lets Plan...',
        'OnboardingScreen',
        'FlightOrderCard',
        'SearchMeta',
        'NotificationPage',
        'VoiceRecognitionComponent',
        'DataSorter',
        'HotelRoomAllocation',
        'ItineraryPage',
        'EssentialDetailsMeta',
        'Flights',
      ],
    },
    {
      name: 'CartNavigatorStack',
      screens: ['My Carts'],
    },
  ],
};

const Promotions = () => {
  // Notification content states
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [redirectLink, setRedirectLink] = useState('');

  // Target audience states
  const [receivers, setReceivers] = useState('1');
  const [mostOrderedCount, setMostOrderedCount] = useState(10);
  const [selectedStack, setSelectedStack] = useState('MainNavigatorStack');
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [availableScreens, setAvailableScreens] = useState([]);

  // User search and selection states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Notification sending states
  const [isSending, setIsSending] = useState(false);
  const [isBatchSending, setIsBatchSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [processedUsers, setProcessedUsers] = useState(0);

  // Add this to your component's style or CSS file
const styles = {
  autocompletePopper: {
    zIndex: 1300, // Make sure it's above other elements
    position: 'relative',
  },
  autocompletePaper: {
    marginTop: '8px', // Add some spacing from the input
    maxHeight: '200px', // Limit height
    overflow: 'auto', // Add scroll if needed
  },
};

  // Update available screens when stack changes
  useEffect(() => {
    const navigator = stackScreenData.navigators.find((nav) => nav.name === selectedStack);
    if (navigator) {
      setAvailableScreens(navigator.screens);
      if (!navigator.screens.includes(selectedScreen)) {
        setSelectedScreen(navigator.screens[0] || '');
      }
    }
  }, [selectedStack]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await axios.post('/getUserByEmail', {
          searchTerm: searchValue
        });
        
        if (response.data.status === 200) {
          const filteredResults = response.data.users.filter(user => 
            !selectedUsers.some(selected => selected.email === user.email)
          );
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [selectedUsers]
  );

  // Handle search term changes
  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
    if (value) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle user selection from dropdown
  const handleUserSelect = (event, value) => {
    if (value && !selectedUsers.some(user => user.email === value.email)) {
      setSelectedUsers([...selectedUsers, value]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Handle Enter key press for exact search
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm) {
      event.preventDefault();
      debouncedSearch.cancel();
      
      // Check if search term matches any existing result
      const exactMatch = searchResults.find(
        user => user.email.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch) {
        handleUserSelect(null, exactMatch);
      } else if (searchTerm.includes('@')) {
        // Add as new user if it looks like an email
        handleUserSelect(null, { email: searchTerm });
      }
    }
  };

  // Remove a selected user
  const handleRemoveUser = (emailToRemove) => {
    setSelectedUsers(selectedUsers.filter(user => user.email !== emailToRemove));
  };

  // Render user search component
  const renderUserSearch = () => (
    <div className="mb-3">
      <Box sx={{ position: 'relative', mb: 3 }}>
      <CFormLabel className="fw-bold">Search and Select Users by Email</CFormLabel>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {selectedUsers.map((user) => (
          <Chip
            key={user.email}
            label={user.email}
            onDelete={() => handleRemoveUser(user.email)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
      
      {/* <Autocomplete
        freeSolo
        options={searchResults}
        getOptionLabel={(option) => option.email}
        inputValue={searchTerm}
        onInputChange={handleSearchChange}
        onChange={handleUserSelect}
        onKeyDown={handleKeyDown}
        loading={isSearching}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Type email and press Enter"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isSearching ? <CSpinner size="sm" /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.email}>
            {option.email}
          </MenuItem>
        )}
        filterOptions={(options) => options}
      /> */}
      <Autocomplete
  freeSolo
  options={searchResults}
  getOptionLabel={(option) => option.email}
  inputValue={searchTerm}
  onInputChange={handleSearchChange}
  onChange={handleUserSelect}
  onKeyDown={handleKeyDown}
  loading={isSearching}
  componentsProps={{
    popper: {
      modifiers: [
        {
          name: 'flip',
          enabled: false,
        },
        {
          name: 'preventOverflow',
          enabled: false,
        },
      ],
    },
  }}
  // PopperComponent={(props) => (
  //   <div style={{ position: 'relative', zIndex: 1300 }}>
  //     <Popper {...props} placement="bottom-start" />
  //   </div>
  // )}
  PopperComponent={(props) => (
  <div style={styles.autocompletePopper}>
    <Popper 
      {...props} 
      placement="bottom-start"
      style={styles.autocompletePaper}
      modifiers={[
        {
          name: 'flip',
          enabled: false,
        },
        {
          name: 'preventOverflow',
          enabled: false,
        },
      ]}
    />
  </div>
)}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Type email and press Enter"
      variant="outlined"
      fullWidth
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {isSearching ? <CSpinner size="sm" /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  renderOption={(props, option) => (
    <MenuItem {...props} key={option.email}>
      {option.email}
    </MenuItem>
  )}
  filterOptions={(options) => options}
/>
</Box>
      
      <Typography variant="caption" color="textSecondary">
        {selectedUsers.length} user(s) selected
      </Typography>
    </div>
  );

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!notificationTitle.trim() || notificationTitle.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid notification title (min 5 characters)',
      });
      return false;
    }

    // if (!notificationContent.trim() || notificationContent.length < 5) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Validation Error',
    //     text: 'Please enter valid notification content (min 5 characters)',
    //   });
    //   return false;
    // }

    if (receivers === '4' && selectedUsers.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select at least one user',
      });
      return false;
    }

    return true;
  };

  // Send notifications
  const handleSendNotification = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    setIsBatchSending(true);
    setProgress(0);
    setProcessedUsers(0);
    setTotalUsers(0);

    try {
      const formData = new FormData();
      formData.append('title', notificationTitle);
      formData.append('description', notificationContent);
      formData.append('redirectLink', redirectLink);
      formData.append('receivers', receivers);
      formData.append('mostOrderedCount', mostOrderedCount);
      formData.append('selectedStack', selectedStack);
      formData.append('selectedScreen', selectedScreen);
      
      if (image) formData.append('image', image);
      
      if (receivers === '4') {
        selectedUsers.forEach((user, index) => {
          formData.append(`userEmails[${index}]`, user.email);
        });
      }

      const response = await axios.post('/pushNotification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Notifications sent to ${response.data.user_count} users`,
      });
      resetForm();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to send notifications';
      const missingEmails = error.response?.data?.missing_emails || [];
      
      if (missingEmails.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Some users not found',
          html: `These emails were not found: <br>${missingEmails.join('<br>')}`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
        });
      }
    } finally {
      setIsSending(false);
      setIsBatchSending(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNotificationTitle('');
    setNotificationContent('');
    setRedirectLink('');
    setImage(null);
    setImagePreview('');
    setReceivers('1');
    setMostOrderedCount(10);
    setSelectedStack('MainNavigatorStack');
    setSelectedScreen('Home');
    setProgress(0);
    setProcessedUsers(0);
    setTotalUsers(0);
    setSelectedUsers([]);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader
            className="text-white d-flex align-items-center"
            style={{ backgroundColor: '#64635A' }}
          >
            <BellFill size={24} className="me-2" />
            <Typography variant="h5" component="div">
              Push Notification
            </Typography>
          </CCardHeader>
          <CCardBody>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <CForm>
                <div className="mb-3">
                  <CFormLabel className="fw-bold">Notification Title*</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <i className="bi bi-card-heading"></i>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter notification title.."
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      disabled={isSending}
                      minLength={5}
                      required
                    />
                  </CInputGroup>
                  <Typography variant="caption" color="textSecondary">
                    {notificationTitle.length}/100 characters
                  </Typography>
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-bold">Notification Content</CFormLabel>
                  <CFormInput
                    as="textarea"
                    rows={5}
                    placeholder="Write your notification content here..."
                    value={notificationContent}
                    onChange={(e) => setNotificationContent(e.target.value)}
                    disabled={isSending}
                    // required
                  />
                </div>

                <div className="mb-3 d-none">
                  <CFormLabel className="fw-bold">Redirect Link</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <i className="bi bi-link-45deg"></i>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Optional deep link URL"
                      value={redirectLink}
                      onChange={(e) => setRedirectLink(e.target.value)}
                      disabled={isSending}
                    />
                  </CInputGroup>
                </div>

                <div className="mb-3 d-none">
                  <CFormLabel className="fw-bold">Notification Image</CFormLabel>
                  <div className="d-flex align-items-center">
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSending}
                      className="me-2"
                      style={{ flex: 1 }}
                    />
                    {imagePreview && (
                      <CButton
                        color="danger"
                        variant="outline"
                        onClick={() => {
                          setImage(null);
                          setImagePreview('');
                          document.querySelector('input[type="file"]').value = '';
                        }}
                        disabled={isSending}
                      >
                        Remove
                      </CButton>
                    )}
                  </div>
                  {imagePreview && (
                    <Box mt={2}>
                      <CImage
                        thumbnail
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-bold">Target Audience*</CFormLabel>
                  <CFormSelect
                    value={receivers}
                    onChange={(e) => setReceivers(e.target.value)}
                    disabled={isSending}
                  >
                    <option value="1">All Users</option>
                    <option value="2">Order Placed Users</option>
                    <option value="3">Order Not Placed Users</option>
                    <option value="4">User Specific</option>
                    <option value="5">Users with products in cart</option>
                  </CFormSelect>
                </div>

                {receivers === '4' && renderUserSearch()}

                {/* {receivers === '5' && (
                  <div className="mb-3">
                    <CFormLabel className="fw-bold">Number of Top Users</CFormLabel>
                    <CFormInput
                      type="number"
                      min="1"
                      value={mostOrderedCount}
                      onChange={(e) => setMostOrderedCount(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                )} */}

                <div className="mb-3 d-none">
                  <CFormLabel className="fw-bold">Navigation Stack*</CFormLabel>
                  <CFormSelect
                    value={selectedStack}
                    onChange={(e) => setSelectedStack(e.target.value)}
                    disabled={isSending}
                  >
                    {stackScreenData.navigators.map((navigator) => (
                      <option key={navigator.name} value={navigator.name}>
                        {navigator.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <div className="mb-3 d-none">
                  <CFormLabel className="fw-bold">Target Screen*</CFormLabel>
                  <CFormSelect
                    value={selectedScreen}
                    onChange={(e) => setSelectedScreen(e.target.value)}
                    disabled={isSending || availableScreens.length === 0}
                  >
                    {availableScreens.map((screen) => (
                      <option key={screen} value={screen}>
                        {screen || 'Default Screen'}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                {isBatchSending && (
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sending notifications... {processedUsers} of {totalUsers} users processed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {progress}%
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                    disabled={isSending}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Send />}
                    onClick={handleSendNotification}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Notification'
                    )}
                  </Button>
                </Box>
              </CForm>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Preview:
              </Typography>
              <Paper
                elevation={2}
                sx={{ p: 2, mt: 1, border: '1px dashed #ccc', whiteSpace: 'pre-line' }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {notificationTitle || 'Notification Title'}
                </Typography>
                {imagePreview && (
                  <Box mt={2} mb={2}>
                    <CImage src={imagePreview} alt="Preview" style={{ maxHeight: '200px' }} />
                  </Box>
                )}
                <Typography>
                  {notificationContent || <em>Notification content will appear here...</em>}
                </Typography>
              </Paper>
            </Box>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Promotions;