import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
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
  FormHelperText,
  LinearProgress,
} from '@mui/material'

import Swal from 'sweetalert2'
import axios from 'axios'
import { BellFill, Send, Image as ImageIcon } from 'react-bootstrap-icons'

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
        // ... (all other screens from your backend)
        'Flights',
      ],
    },
    {
      name: 'CartNavigatorStack',
      screens: ['My Carts'],
    },
  ],
}

const Promotions = () => {
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationContent, setNotificationContent] = useState('')

  const [description, setDescription] = useState('')
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isSending, setIsSending] = useState(false)
  const [redirectLink, setRedirectLink] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [receivers, setReceivers] = useState('1') // Default to all users
  const [mostOrderedCount, setMostOrderedCount] = useState(10)
  const [selectedStack, setSelectedStack] = useState('MainNavigatorStack')
  const [selectedScreen, setSelectedScreen] = useState('Home')
  const [availableScreens, setAvailableScreens] = useState([])
  const [progress, setProgress] = useState(0)
  const [isBatchSending, setIsBatchSending] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [processedUsers, setProcessedUsers] = useState(0)
  const [batchResponses, setBatchResponses] = useState([])

  // Update available screens when stack changes
  useEffect(() => {
    const navigator = stackScreenData.navigators.find((nav) => nav.name === selectedStack)
    if (navigator) {
      setAvailableScreens(navigator.screens)
      if (!navigator.screens.includes(selectedScreen)) {
        setSelectedScreen(navigator.screens[0] || '')
      }
    }
  }, [selectedStack])

  const handleContentChange = (e) => {
    setNotificationContent(e.target.value)
    // For preview, you can use the same value or format it if needed
    setDescription(e.target.value)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  const validateForm = () => {
    if (!notificationTitle.trim() || notificationTitle.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid notification title (min 5 characters)',
      })
      return false
    }

    // Check notificationContent instead of editorState
    if (!notificationContent.trim() || notificationContent.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter valid notification content (min 5 characters)',
      })
      return false
    }

    if (!selectedStack) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select a stack',
      })
      return false
    }

    return true
  }

  const sendBatchNotifications = async (offset = 0) => {
    const formData = new FormData()
    formData.append('title', notificationTitle)
    formData.append('description', notificationContent) // Use notificationContent here

    // formData.append('description', description);
    formData.append('redirectLink', redirectLink)
    if (image) formData.append('image', image)
    formData.append('mostOrderedCount', mostOrderedCount)
    formData.append('selectedStack', selectedStack)
    formData.append('selectedScreen', selectedScreen)
    formData.append('offset', offset)

    try {
      const response = await axios.post('/pushNotification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response.data, 'Batch response data')
      const { current, total, responses } = response.data

      setBatchResponses((prev) => [...prev, ...responses])
      setProcessedUsers(current)
      setTotalUsers(total)
      setProgress(Math.round((current / total) * 100))

      if (current < total) {
        // Continue with next batch
        // await sendBatchNotifications(current);
        return await sendBatchNotifications(current)
      } else {
        // All batches completed
        setIsBatchSending(false)
        Swal.fire({
          icon: 'success',
          title: 'Completed!',
          text: `Notifications sent successfully!`,
        })
        return response.data // Return the final response
      }
    } catch (error) {
      setIsBatchSending(false)
      console.error('Batch notification error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message || 'Failed to send batch notifications. Please try again.',
      })
    }
  }

  const resetForm = () => {
    setNotificationTitle('')
    // setEditorState(EditorState.createEmpty());
    setNotificationContent('') // Reset the content
    setRedirectLink('')
    setImage(null)
    setImagePreview('')
    setReceivers('1') // Reset to default "All Users"
    setMostOrderedCount(10) // Reset to default count
    setSelectedStack('MainNavigatorStack') // Reset to default stack
    setSelectedScreen('Home') // Reset to default screen
    setProgress(0)
    setProcessedUsers(0)
    setTotalUsers(0)
    setBatchResponses([])
    setNotificationContent('')
  }

  const handleSendNotification = async () => {
    if (!validateForm()) return

    setIsSending(true)
    setIsBatchSending(true)
    setProgress(0)
    setProcessedUsers(0)
    setTotalUsers(0)
    setBatchResponses([])

    // try {
    // const response =  await sendBatchNotifications(0); // Start with offset 0
    // console.log(response,"Response data");
    // if(response.status != 200){
    //   setIsSending(false);
    //   setIsBatchSending(false);

    // }
    // } catch (error) {
    //   setIsSending(false);
    //   setIsBatchSending(false);
    // }
    try {
      const finalResponse = await sendBatchNotifications(0)
      console.log('Complete notification process finished:', finalResponse)
      resetForm() // Reset all form fields
    } catch (error) {
      console.error('Error in notification process:', error)
    } finally {
      setIsSending(false)
      setIsBatchSending(false)
    }
  }
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
                  <CFormLabel className="fw-bold">Notification Content*</CFormLabel>
                  {/* <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    wrapperClassName="border rounded"
                    editorClassName="px-3 min-h-[200px]"
                    placeholder="Write your notification content here (min 5 characters)..."
                    toolbarHidden
                  /> */}
                  <CFormInput
                    as="textarea"
                    rows={5} // Adjust rows as needed
                    placeholder="Write your notification content here..."
                    value={notificationContent}
                    onChange={handleContentChange}
                    disabled={isSending}
                    // minLength={5}
                    required
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
                          setImage(null)
                          setImagePreview('')
                          // Clear the file input value
                          document.querySelector('input[type="file"]').value = ''
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
                {/* <div className="mb-3">
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
                </div> */}

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
                    onClick={resetForm} // Use the reset function
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
  )
}

export default Promotions
