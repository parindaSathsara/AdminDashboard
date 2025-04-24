import React, { useState, useEffect } from 'react';
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
  CImage
} from '@coreui/react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BellFill, Send, Image as ImageIcon } from 'react-bootstrap-icons';

const stackScreenData = {
  navigators: [
    {
      name: "HomeNavigator",
      screens: [""]
    },
    {
      name: "LoginNavigator",
      screens: [
        "LoginMainPage", "LoginPage", "SignInUsingPassword", "MobileLogin", 
        "OneTimePass", "MobileNumberLogin", "ForgotPassword", "VerifyCodeAndResetPass", 
        "ProfileLogin", "OnboardingScreen"
      ]
    },
    {
      name: "MessageNavigator",
      screens: ["CustomerChatMain", "ChatPage"]
    },
    {
      name: "MainNavigatorStack",
      screens: [
        "Home", "Order Edit", "WebXMainPortal", "Lets Plan...", "OnboardingScreen",
        "FlightOrderCard", "SearchMeta", "NotificationPage", "VoiceRecognitionComponent",
        "DataSorter", "HotelRoomAllocation", "ItineraryPage", "EssentialDetailsMeta",
        // ... (all other screens from your backend)
        "Flights"
      ]
    },
    {
      name: "CartNavigatorStack",
      screens: ["My Carts"]
    }
  ]
};

const Promotions = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isSending, setIsSending] = useState(false);
  const [redirectLink, setRedirectLink] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [receivers, setReceivers] = useState('1'); // Default to all users
  const [mostOrderedCount, setMostOrderedCount] = useState(10);
  const [selectedStack, setSelectedStack] = useState('MainNavigatorStack');
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [availableScreens, setAvailableScreens] = useState([]);

  // Update available screens when stack changes
  useEffect(() => {
    const navigator = stackScreenData.navigators.find(nav => nav.name === selectedStack);
    if (navigator) {
      setAvailableScreens(navigator.screens);
      if (!navigator.screens.includes(selectedScreen)) {
        setSelectedScreen(navigator.screens[0] || '');
      }
    }
  }, [selectedStack]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    setDescription(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!notificationTitle.trim() || notificationTitle.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid notification title (min 5 characters)'
      });
      return false;
    }

    const contentText = editorState.getCurrentContent().getPlainText();
    if (!contentText.trim() || contentText.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter valid notification content (min 5 characters)'
      });
      return false;
    }

    if (!selectedStack) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select a stack'
      });
      return false;
    }

    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append('title', notificationTitle);
    formData.append('description', description);
    formData.append('redirectLink', redirectLink);
    if (image) formData.append('image', image);
    formData.append('mostOrderedCount', mostOrderedCount);
    formData.append('selectedStack', selectedStack);
    formData.append('selectedScreen', selectedScreen);
    formData.append('receivers', receivers);

    try {
      const response = await axios.post('/pushNotification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Notification sent successfully!'
      });

      // Reset form
      setNotificationTitle('');
      setEditorState(EditorState.createEmpty());
      setDescription('');
      setRedirectLink('');
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Notification error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to send notification. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader className="text-white d-flex align-items-center" style={{ backgroundColor: '#64635A' }}>
            <BellFill size={24} className="me-2" />
            <Typography variant="h5" component="div">Push Notification</Typography>
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
                      placeholder="Enter notification title (min 5 characters)"
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
                  <CFormLabel className="fw-bold">Notification Content*</CFormLabel>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    wrapperClassName="border rounded"
                    editorClassName="px-3 min-h-[200px]"
                    placeholder="Write your notification content here (min 5 characters)..."
                    toolbarHidden
                  />
                </div>

                <div className="mb-3">
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

                <div className="mb-3">
                  <CFormLabel className="fw-bold">Notification Image</CFormLabel>
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSending}
                  />
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
                    <option value="2">New Users (Last 1 Month)</option>
                    <option value="3">New Users (Last 3 Months)</option>
                    <option value="4">Top Ordering Users</option>
                  </CFormSelect>
                </div>

                {receivers === '4' && (
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
                )}

                <div className="mb-3">
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

                <div className="mb-3">
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setNotificationTitle('');
                      setEditorState(EditorState.createEmpty());
                      setDescription('');
                      setRedirectLink('');
                      setImage(null);
                      setImagePreview('');
                    }}
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
              <Paper elevation={2} sx={{ p: 2, mt: 1, border: '1px dashed #ccc' }}>
                <Typography variant="h6" fontWeight="bold">
                  {notificationTitle || 'Notification Title'}
                </Typography>
                {imagePreview && (
                  <Box mt={2} mb={2}>
                    <CImage
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxHeight: '200px' }}
                    />
                  </Box>
                )}
                <Box
                  sx={{ mt: 1 }}
                  dangerouslySetInnerHTML={{
                    __html: description || '<em>Notification content will appear here...</em>'
                  }}
                />
              </Paper>
            </Box>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Promotions;