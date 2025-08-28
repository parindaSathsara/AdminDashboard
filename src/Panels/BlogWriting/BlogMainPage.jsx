import React, { useContext, useState, useEffect } from 'react'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState } from 'draft-js'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { UserLoginContext } from 'src/Context/UserLoginContext';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormLabel,
  CButton,
  CRow,
  CFormInput,
  CSpinner,
  CImage
} from '@coreui/react';

const BlogSchema = Yup.object().shape({
  title: Yup.string()
    .min(4, 'Title too Short!')
    .max(100, 'Title too Long!')
    .required('Title is required'),
  summary: Yup.string()
    .min(50, 'Summary too Short!')
    .max(530, 'Summary too Long!')
    .required('Summary is required'),
})

const BlogMainPage = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [generatingSummery, setGeneratingSummery] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { userData } = useContext(UserLoginContext);
  const [isLoading, setIsLoading] = useState(false)
  const [hasVisibleContent, setHasVisibleContent] = useState(false)

  const styles = {
    formLabel: {
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
    },
  }

  // Check if editor has visible content (not just formatting)
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    
    // Check if there's actual visible text content (not just empty blocks or formatting)
    const hasRealContent = plainText.trim().length > 0;
    
    setHasVisibleContent(hasRealContent);
  }, [editorState]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const handleEditorChange = (state) => {
    setEditorState(state)
  }

  const summarize = async (setFieldValue) => {
    const contentText = editorState.getCurrentContent().getPlainText()
    setGeneratingSummery(true)

    if (contentText.length < 200) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Description is too short to summarize!'
      })
      setGeneratingSummery(false)
      return
    }

    try {
      const response = await axios.post('/summarizeDescription', {
        content: contentText
      })

      setFieldValue('summary', response.data.summary)

      Swal.fire({
        icon: 'success',
        title: 'Summary Generated',
        text: 'Summary generated successfully!'
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate summary. Please try again.'
      })
    } finally {
      setGeneratingSummery(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting: formikSetSubmitting, resetForm }) => {
    setSubmitting(true)

    const errors = [];

    if (!values.title) {
      errors.push('Title is required');
    }

    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const contentText = editorState.getCurrentContent().getPlainText();
    
    // More accurate content validation
    if (!contentText.trim() || contentHtml === '<p></p>' || contentHtml === '<p><br></p>') {
      errors.push('Content is required');
    }

    if (!values.summary) {
      errors.push('Summary is required');
    }

    if (imageFiles.length === 0) {
      errors.push('At least one image is required');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: errors.join('<br/>')
      });
      setSubmitting(false);
      formikSetSubmitting(false);
      return;
    }

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', contentHtml)
    formData.append('summary', values.summary)
    imageFiles.forEach((file) => {
      formData.append('images[]', file)
    })

    try {
      setIsLoading(true)
      const response = await axios.post('/addBlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Blog post created successfully!'
      })

      // Reset form
      resetForm()
      setEditorState(EditorState.createEmpty())
      setImageFiles([])
      setImagePreviews([])
      setIsLoading(false)

    } catch (error) {
      console.error('Submission error:', error)

      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed'

        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: firstError
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.'
        })
      }
    } finally {
      setSubmitting(false)
      formikSetSubmitting(false)
    }
  }

  return (
    <CContainer>
      <style>
        {`
          .hide-toolbar .rdw-editor-toolbar {
            display: none !important;
          }
          .editor-wrapper {
            position: relative;
            border: 1px solid #ced4da;
            border-radius: 4px;
          }
          .custom-placeholder {
            position: absolute;
            top: 45px;
            left: 15px;
            color: #6c757d;
            pointer-events: none;
            z-index: 1;
          }
          .has-content .custom-placeholder {
            display: none;
          }
          .rdw-editor-main {
            min-height: 200px;
            padding: 12px;
          }
        `}
      </style>
      
      {isLoading ? <div className="d-flex justify-content-center"><CSpinner style={{ marginTop: "15%" }} /></div> :
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-secondary text-white">
                  <h4 className="mb-0">Share a creative experience 🎨✨</h4>
                </div>

                <div className="card-body">
                  <Formik
                    initialValues={{
                      title: '',
                      summary: '',
                    }}
                    validationSchema={BlogSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="title" style={styles.formLabel} className="form-label">
                            Title*
                          </label>
                          <Field
                            id="title"
                            name="title"
                            className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''
                              }`}
                            placeholder="Enter your blog title"
                            disabled={submitting}
                            required
                          />
                          {errors.title && touched.title && (
                            <div className="invalid-feedback">{errors.title}</div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label style={styles.formLabel} className="form-label">
                            Images*
                          </label>
                          <CFormInput
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            required
                          />
                        </div>

                        {imagePreviews.length > 0 && (
                          <div className="mb-3">
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                              }}
                            >
                              {imagePreviews.map((preview, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                      width: '100px',
                                      height: '100px',
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mb-3">
                          <label style={styles.formLabel} className="form-label">
                            Content*
                          </label>
                          <div className={`editor-wrapper ${hasVisibleContent ? 'has-content' : 'hide-toolbar'}`}>
                            <Editor
                              editorState={editorState}
                              onEditorStateChange={handleEditorChange}
                              wrapperClassName=""
                              editorClassName=""
                              toolbar={{
                                options: ['inline', 'blockType', 'list', 'emoji'],
                              }}
                            />
                            {!hasVisibleContent && (
                              <div className="custom-placeholder">
                                Write your blog content here...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label style={styles.formLabel} htmlFor="summary" className="form-label mb-0">
                              Summary*
                            </label>
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => summarize(setFieldValue)}
                              disabled={generatingSummery || submitting || !hasVisibleContent}
                            >
                              {generatingSummery ? (
                                <>
                                  <CSpinner size="sm" className="me-2" />
                                  Generating...
                                </>
                              ) : (
                                'Generate Summary'
                              )}
                            </button>
                          </div>
                          <Field
                            as="textarea"
                            id="summary"
                            name="summary"
                            className={`form-control ${errors.summary && touched.summary ? 'is-invalid' : ''
                              }`}
                            placeholder="Enter a brief summary of your blog"
                            rows="3"
                            disabled={submitting}
                            required
                          />
                          {errors.summary && touched.summary && (
                            <div className="invalid-feedback">{errors.summary}</div>
                          )}
                        </div>

                        <div className="d-flex justify-content-end">
                          {
                            userData?.permissions?.includes("add blog") &&
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={submitting || generatingSummery}
                            >
                              {submitting ? (
                                <>
                                  <CSpinner size="sm" className="me-2" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Blog'
                              )}
                            </button>
                          }
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          {submitting && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
              <CSpinner style={{ width: '4rem', height: '4rem', color: '#ffffff' }} />
            </div>
          )}
        </div>
      }
    </CContainer>
  )
}

export default BlogMainPage