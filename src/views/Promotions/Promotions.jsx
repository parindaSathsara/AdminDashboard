import React, { useState } from 'react';
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
  CSpinner
} from '@coreui/react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  IconButton, 
  Divider,
  Tooltip
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  BellFill,
  Send,
} from 'react-bootstrap-icons';

const Promotions = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isSending, setIsSending] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const styles = {
    formLabel: {
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
    },
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const generateSummary = async () => {
    const contentText = editorState.getCurrentContent().getPlainText();
    setGeneratingSummary(true);

    if (contentText.length < 200) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Content is too short to summarize!'
      });
      setGeneratingSummary(false);
      return;
    }

    try {
      const response = await axios.post('/summarizeDescription', {
        content: contentText
      });

      setNotificationTitle(response.data.summary);

      Swal.fire({
        icon: 'success',
        title: 'Summary Generated',
        text: 'Title generated successfully from your content!'
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate title. Please try again.'
      });
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSendNotification = () => {
    if (!notificationTitle.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a notification title'
      });
      return;
    }

    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (!contentHtml || contentHtml === '<p></p>') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter notification content'
      });
      return;
    }

    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Sending notification:', {
        title: notificationTitle,
        content: contentHtml
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Notification sent successfully!'
      });
      
      setIsSending(false);
      setNotificationTitle('');
      setEditorState(EditorState.createEmpty());
    }, 2000);
  };

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader className=" text-white d-flex align-items-center" style={{ backgroundColor: '#64635A' }}>
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label style={styles.formLabel} htmlFor="title" className="form-label mb-0">
                      Notification Title
                    </label>
                    {/* <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={generateSummary}
                      disabled={generatingSummary || isSending}
                    >
                      {generatingSummary ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Generating...
                        </>
                      ) : (
                        'Generate Title from Content'
                      )}
                    </button> */}
                  </div>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <i className="bi bi-card-heading"></i>
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter notification title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      disabled={isSending}
                    />
                  </CInputGroup>
                </div>
                
                <div className="mb-3">
                  <label style={styles.formLabel} className="form-label">
                    Notification Content
                  </label>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    wrapperClassName="border rounded"
                    editorClassName="px-3 min-h-[200px]"
                    toolbar={{
                      options: ['inline', 'blockType', 'list', 'link', 'emoji'],
                      inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                      },
                    }}
                    placeholder="Write your notification content here..."
                  />
                </div>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    onClick={() => {
                      setNotificationTitle('');
                      setEditorState(EditorState.createEmpty());
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
              <Typography variant="subtitle2" color="text.secondary">
                Preview:
              </Typography>
              <Paper elevation={2} sx={{ p: 2, mt: 1, border: '1px dashed #ccc' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {notificationTitle || 'Notification Title'}
                </Typography>
                <Box 
                  sx={{ mt: 1 }}
                  dangerouslySetInnerHTML={{ 
                    __html: editorState.getCurrentContent().getPlainText() ? 
                      draftToHtml(convertToRaw(editorState.getCurrentContent())) : 
                      '<em>Notification content will appear here...</em>' 
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