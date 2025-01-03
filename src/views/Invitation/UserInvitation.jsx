import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CImage,
} from '@coreui/react'
import axios from 'axios'
import cardImage from '../../assets/images/card_template.jpg'



const UserInvitation = () => {
  // Utility function to convert SVG to PNG
  const convertSvgToPng = (svgUrl, width = 1024, height = 1024) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      canvas.width = width
      canvas.height = height

      img.crossOrigin = 'anonymous' // Handle CORS issues

      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas to Blob conversion failed'))
          }
        }, 'image/png')
      }

      img.onerror = () => {
        reject(new Error('Image loading failed'))
      }

      img.src = svgUrl
    })
  }
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    contact: '',
    office_address: '',
    email: '',
    whatsapp: '',
    photo: null,
    info: '',
  })

  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrCodeDisplayUrl, setQrCodeDisplayUrl] = useState(null)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required'
    if (!formData.office_address.trim()) newErrors.office_address = 'Office address is required'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) newErrors.email = 'Valid email is required'

    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required'
    if (!formData.photo) newErrors.photo = 'Photo is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'File size should be less than 2MB',
        }))
        return
      }

      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Please upload a valid image file (JPEG, PNG, JPG, GIF)',
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Function to create blob URL from SVG string
  const createSvgUrl = (svgString) => {
    const decodedSvg = decodeURIComponent(svgString.split('<?xml')[1])
    const svgContent = `<?xml${decodedSvg}`
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
    return URL.createObjectURL(svgBlob)
  }

  // Update handleSubmit to create display URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    const formPayload = new FormData()
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key])
    })

    try {
      const response = await axios.post('user-invitations', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        // Create display URL for the QR code
        const displayUrl = createSvgUrl(response.data.qrCodeUrl)
        setQrCodeDisplayUrl(displayUrl)

        setSubmissionResult({
          ...response.data.user,
          qrCodeUrl: response.data.qrCodeUrl,
        })
      } else {
        throw new Error(response.data.error || 'Submission failed')
      }
    } catch (error) {
      // ... existing error handling
    } finally {
      setLoading(false)
    }
  }

  // Cleanup function for the blob URL
  useEffect(() => {
    return () => {
      if (qrCodeDisplayUrl) {
        URL.revokeObjectURL(qrCodeDisplayUrl)
      }
    }
  }, [qrCodeDisplayUrl])

  const handleDownload = async () => {
    if (!submissionResult?.qrCodeUrl) return;

  setIsDownloading(true);
  setIsDownloading(true);
try {
  // Create canvas with business card dimensions (standard size 3.5 x 2 inches at 300 DPI)
  const canvas = document.createElement('canvas');
  canvas.width = 1086.9; // 3.5 inches * 300 DPI
  canvas.height = 638.1; // 2 inches * 300 DPI
  const ctx = canvas.getContext('2d');

  // Calculate padding (9.3mm = ~110.55 pixels at 300 DPI)
  const padding = 110.55;

  // Create background image
  const backgroundImage = new Image();
  backgroundImage.src = cardImage;

  return new Promise((resolve, reject) => {
    backgroundImage.onload = () => {
      // Draw background image
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Load and draw QR code
      const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1]);
      const svgContent = `<?xml${decodedSvg}`;
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const qrImage = new Image();
      qrImage.onload = () => {
        // Draw QR code with padding
        ctx.drawImage(qrImage, padding, 200, 250, 250);

        // Name - using red color and larger font with padding
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 48px "Rubik Regular"';
        ctx.fillText(submissionResult.name, padding, 100);

        // Designation with padding
        ctx.fillStyle = '#003366';
        ctx.font = '32px "Rubik Regular"';
        ctx.fillText(`${submissionResult.designation} | Marketing`, padding, 150);

        // Contact details with adjusted positioning
        ctx.fillStyle = '#003366';
        ctx.font = '24px Arial';
        const contactY = 200;
        const contentX = padding + 270; // Adjusted for padding + QR code width
        ctx.fillText(`${submissionResult.contact} | ${submissionResult.email}`, contentX, contactY);

        // Address
        ctx.fillText('One Galle Face Tower, 2208, 1A Centre Road,', contentX, contactY + 40);
        ctx.fillText('Colombo 002, Sri Lanka', contentX, contactY + 80);

        // Head Office
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Head Office', contentX, contactY + 140);
        ctx.font = '24px Arial';
        ctx.fillText('+94 11 235 2400', contentX, contactY + 180);
        ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', contentX, contactY + 220);
        ctx.fillText('Genting Block, 349565, Singapore', contentX, contactY + 260);

        // Countries text at bottom with bold country codes
        ctx.fillStyle = '#FF0000';
        ctx.font = '24px Arial';
        const countriesY = contactY + 320;
        ctx.fillText('Countries Of Operation : ', padding, countriesY);

        // Calculate starting position after the prefix text
        const prefixText = 'Countries Of Operation : ';
        const prefixWidth = ctx.measureText(prefixText).width;

        // Draw bold country codes
        ctx.font = 'bold 24px Arial';
        const countryCodesX = padding + prefixWidth;
        ctx.fillText('SG | MY | VN | LK | MV', countryCodesX, countriesY);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            const downloadUrl = URL.createObjectURL(blob);
            link.href = downloadUrl;
            link.download = `${submissionResult.name.toLowerCase().replace(/\s+/g, '-')}-business-card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(downloadUrl);
            URL.revokeObjectURL(svgUrl);
            setIsDownloading(false);
            resolve();
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, 'image/png');
      };

      qrImage.onerror = () => {
        reject(new Error('QR code image loading failed'));
        setIsDownloading(false);
      };

      qrImage.src = svgUrl;
    };

    backgroundImage.onerror = () => {
      reject(new Error('Background image loading failed'));
      setIsDownloading(false);
    };
  });
} catch (error) {
  console.error('Download failed:', error);
  setErrors(prev => ({
    ...prev,
    download: 'Failed to download business card. Please try again.'
  }));
  setIsDownloading(false);
}
    // try {
    //   // Import html2canvas dynamically
    //   const html2canvas = (await import('html2canvas')).default

    //   // Get the div element
    //   const element = document.getElementById('download-content')
    //   if (!element) return

    //   // Create canvas
    //   const canvas = await html2canvas(element)

    //   // Convert to JPEG
    //   const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

    //   // Create download link
    //   const link = document.createElement('a')
    //   link.download = 'downloaded-content.jpg'
    //   link.href = dataUrl

    //   // Trigger download
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // } catch (error) {
    //   console.error('Error downloading image:', error)
    // }
  }

  return (
    <div className="container-lg">
      {!submissionResult ? (
        <CCard className="mb-4">
          <CCardHeader>
            <h4 className="mb-0">User Invitation Form</h4>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-4">
                <CCol md={6}>
                  <div>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      invalid={!!errors.name}
                      feedback={errors.name}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Designation</CFormLabel>
                    <CFormInput
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      invalid={!!errors.designation}
                      feedback={errors.designation}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Contact</CFormLabel>
                    <CFormInput
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      invalid={!!errors.contact}
                      feedback={errors.contact}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Office Address</CFormLabel>
                    <CFormInput
                      type="text"
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleInputChange}
                      invalid={!!errors.office_address}
                      feedback={errors.office_address}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      invalid={!!errors.email}
                      feedback={errors.email}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>WhatsApp</CFormLabel>
                    <CFormInput
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      invalid={!!errors.whatsapp}
                      feedback={errors.whatsapp}
                    />
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Photo</CFormLabel>
                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <CButton component="label" color="primary">
                          Upload Photo
                          <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                        </CButton>
                        {errors.photo && (
                          <div className="text-danger small mt-1">{errors.photo}</div>
                        )}
                      </div>
                      {preview && (
                        <CImage
                          rounded
                          thumbnail
                          src={preview}
                          width={64}
                          height={64}
                          alt="Preview"
                        />
                      )}
                    </div>
                  </div>
                </CCol>

                <CCol md={6}>
                  <div>
                    <CFormLabel>Additional Info</CFormLabel>
                    <CFormTextarea
                      name="info"
                      value={formData.info}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </CCol>
              </CRow>

              {errors.submit && (
                <CAlert color="danger" className="mt-3">
                  {errors.submit}
                </CAlert>
              )}

              <div className="mt-4">
                <CButton type="submit" color="primary" disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Invitation'
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      ) : (
        <CCard>
          <CCardHeader>
            <h4 className="mb-0">Invitation Created Successfully!</h4>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <h5 className="mb-3">User Details</h5>
                <div className="mb-2">
                  <strong>Name:</strong> {submissionResult.name}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {submissionResult.designation}
                </div>
                <div className="mb-2">
                  <strong>Contact:</strong> {submissionResult.contact}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {submissionResult.email}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {submissionResult.whatsapp}
                </div>
                <div className="mb-2">
                  <strong>Office Address:</strong> {submissionResult.office_address}
                </div>
              </CCol>
              <CCol md={6} className="text-center">
                <h5 className="mb-3">QR Code</h5>
                {submissionResult.qrCodeUrl && (
                  <>
                    {/* <CImage
                      src={submissionResult.qrCodeUrl}
                      alt="QR Code"
                      className="mw-100 h-auto mb-3"
                    /> */}
                    <CImage
                      src={qrCodeDisplayUrl} // Use the blob URL here
                      alt="QR Code"
                      className="mw-100 h-auto mb-3"
                    />
                    <div>
                      <CButton color="primary" onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Converting...
                          </>
                        ) : (
                          'Download QR Code (PNG)'
                        )}
                      </CButton>
                    </div>
                    <p className="text-muted small mt-2">Scan to view details</p>
                  </>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* <div
        className="p-6 rounded-lg shadow-md relative min-h-[300px] overflow-hidden"
        id="download-content"
        style={{
          backgroundImage: `url(${cardImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '184mm', // Set width to 92mm
          height: '108mm', // Set height to 54mm
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-white">Sample Content</h2>
          <p className="text-gray-200">
            This is an example div that will be downloaded as a JPEG image. You can customize this
            content as needed.
          </p>
        </div>
      </div> */}
    </div>
  )
}

export default UserInvitation
