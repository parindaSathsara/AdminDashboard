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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import axios from 'axios'
import cardImage from '../../assets/images/card_template.jpg'
import QRCodeDisplay from './QRCodeDisplay '
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const UserInvitation = () => {
  // Add this function to clear form data
  const clearFormData = () => {
    setFormData({
      name: '',
      designation: '',
      contact: '',
      office_address: '',
      email: '',
      whatsapp: '',
      photo: null,
      info: '',
    })
    setPreview(null)
    setErrors({})
    setSubmissionResult(null)
  }
  // Update the tab switching function
  const handleTabChange = (tabNumber) => {
    // Clear form data when switching to New Invitation tab
    if (tabNumber === 1) {
      clearFormData()
    }
    setActiveTab(tabNumber)
  }

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

  // New state for tabs and modals
  const [activeTab, setActiveTab] = useState(1)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrCodeDisplayUrl, setQrCodeDisplayUrl] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  // Fetch all users
  // Update fetchUsers to properly handle errors and loading state
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('user-invitations')
      if (response.data.success) {
        setUsers(response.data.users)
        // Also update filtered users if there's a search term
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase()
          const filtered = response.data.users.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTermLower) ||
              user.email.toLowerCase().includes(searchTermLower) ||
              user.designation.toLowerCase().includes(searchTermLower),
          )
          setFilteredUsers(filtered)
        } else {
          setFilteredUsers(response.data.users)
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 2) {
      fetchUsers()
    }
  }, [activeTab])

  // Handle user details view
  const handleViewDetails = (user) => {
    setSelectedUser(user)
    console.log('user', user)
    const displayUrl = createSvgUrl(user.qr_code_path)
    setQrCodeDisplayUrl(displayUrl)
    setShowModal(true)
  }

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData(user)
    const displayUrl = createSvgUrl(user.qr_code_path)
    setQrCodeDisplayUrl(displayUrl)
    setShowEditModal(true)
  }

  // Update users filtering when search term or users list changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.designation.toLowerCase().includes(searchTermLower),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // Update handleUpdate function
  const handleUpdate = async () => {
    try {
      setLoading(true)

      const formPayload = new FormData()

      Object.keys(formData).forEach((key) => {
        if (key === 'photo') {
          if (formData.photo instanceof File) {
            formPayload.append('photo', formData.photo)
          }
        } else {
          formPayload.append(key, formData[key])
        }
      })

      const response = await axios.post(`user-invitations/${selectedUser.email}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })

      if (response.data.success) {
        const updatedUsers = users.map((user) =>
          user.email === selectedUser.email ? response.data.user : user,
        )
        setUsers(updatedUsers)

        const updatedFilteredUsers = filteredUsers.map((user) =>
          user.email === selectedUser.email ? response.data.user : user,
        )
        setFilteredUsers(updatedFilteredUsers)

        // Clear form data after successful update
        clearFormData()
        setShowEditModal(false)
        await fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to update user. Please try again.',
      }))
    } finally {
      setLoading(false)
    }
  }

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

  // In your component, add this handler
  const handlePhoneChange = (value) => {
    console.log(value)

    setFormData((prev) => ({
      ...prev,
      contact: value || '',
    }))
    console.log(formData.contact)
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

  // const handleDownload = async () => {
  //   if (!submissionResult?.qrCodeUrl) return

  //   setIsDownloading(true)
  //   setIsDownloading(true)
  //   try {
  //     // Create canvas with business card dimensions (standard size 3.5 x 2 inches at 300 DPI)
  //     const canvas = document.createElement('canvas')
  //     canvas.width = 1086.9 // 3.5 inches * 300 DPI
  //     canvas.height = 638.1 // 2 inches * 300 DPI
  //     const ctx = canvas.getContext('2d')

  //     // Calculate padding (9.3mm = ~110.55 pixels at 300 DPI)
  //     const padding = 110.55

  //     // Create background image
  //     const backgroundImage = new Image()
  //     backgroundImage.src = cardImage

  //     return new Promise((resolve, reject) => {
  //       backgroundImage.onload = () => {
  //         // Draw background image
  //         ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  //         // Load and draw QR code
  //         const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1])
  //         const svgContent = `<?xml${decodedSvg}`
  //         const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
  //         const svgUrl = URL.createObjectURL(svgBlob)

  //         const qrImage = new Image()
  //         qrImage.onload = () => {
  //           // Draw QR code with padding
  //           ctx.drawImage(qrImage, padding, 200, 250, 250)

  //           // Name - using red color and larger font with padding
  //           ctx.fillStyle = '#FF0000'
  //           ctx.font = 'bold 48px "Rubik Regular"'
  //           ctx.fillText(submissionResult.name, padding, 100)

  //           // Designation with padding
  //           ctx.fillStyle = '#003366'
  //           ctx.font = '32px "Rubik Regular"'
  //           ctx.fillText(`${submissionResult.designation} | Marketing`, padding, 150)

  //           // Contact details with adjusted positioning
  //           ctx.fillStyle = '#003366'
  //           ctx.font = '24px Arial'
  //           const contactY = 200
  //           const contentX = padding + 270 // Adjusted for padding + QR code width
  //           ctx.fillText(
  //             `${submissionResult.contact} | ${submissionResult.email}`,
  //             contentX,
  //             contactY,
  //           )

  //           // Address
  //           // ctx.fillText('One Galle Face Tower, 2208, 1A Centre Road,', contentX, contactY + 40)
  //           ctx.fillText(`${submissionResult.address}`, contentX, contactY + 40)
  //           ctx.fillText('Colombo 002, Sri Lanka', contentX, contactY + 80)

  //           // Head Office
  //           ctx.font = 'bold 24px Arial'
  //           ctx.fillText('Head Office', contentX, contactY + 140)
  //           ctx.font = '24px Arial'
  //           ctx.fillText('+94 11 235 2400', contentX, contactY + 180)
  //           ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', contentX, contactY + 220)
  //           ctx.fillText('Genting Block, 349565, Singapore', contentX, contactY + 260)

  //           // Countries text at bottom with bold country codes
  //           ctx.fillStyle = '#FF0000'
  //           ctx.font = '24px Arial'
  //           const countriesY = contactY + 320
  //           ctx.fillText('Countries Of Operation : ', padding, countriesY)

  //           // Calculate starting position after the prefix text
  //           const prefixText = 'Countries Of Operation : '
  //           const prefixWidth = ctx.measureText(prefixText).width

  //           // Draw bold country codes
  //           ctx.font = 'bold 24px Arial'
  //           const countryCodesX = padding + prefixWidth
  //           ctx.fillText('SG | MY | VN | LK | MV', countryCodesX, countriesY)

  //           // Convert to PNG and download
  //           canvas.toBlob((blob) => {
  //             if (blob) {
  //               const link = document.createElement('a')
  //               const downloadUrl = URL.createObjectURL(blob)
  //               link.href = downloadUrl
  //               link.download = `${submissionResult.name
  //                 .toLowerCase()
  //                 .replace(/\s+/g, '-')}-business-card.png`
  //               document.body.appendChild(link)
  //               link.click()
  //               document.body.removeChild(link)

  //               URL.revokeObjectURL(downloadUrl)
  //               URL.revokeObjectURL(svgUrl)
  //               setIsDownloading(false)
  //               resolve()
  //             } else {
  //               reject(new Error('Canvas to Blob conversion failed'))
  //             }
  //           }, 'image/png')
  //         }

  //         qrImage.onerror = () => {
  //           reject(new Error('QR code image loading failed'))
  //           setIsDownloading(false)
  //         }

  //         qrImage.src = svgUrl
  //       }

  //       backgroundImage.onerror = () => {
  //         reject(new Error('Background image loading failed'))
  //         setIsDownloading(false)
  //       }
  //     })
  //   } catch (error) {
  //     console.error('Download failed:', error)
  //     setErrors((prev) => ({
  //       ...prev,
  //       download: 'Failed to download business card. Please try again.',
  //     }))
  //     setIsDownloading(false)
  //   }
  //   // try {
  //   //   // Import html2canvas dynamically
  //   //   const html2canvas = (await import('html2canvas')).default

  //   //   // Get the div element
  //   //   const element = document.getElementById('download-content')
  //   //   if (!element) return

  //   //   // Create canvas
  //   //   const canvas = await html2canvas(element)

  //   //   // Convert to JPEG
  //   //   const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

  //   //   // Create download link
  //   //   const link = document.createElement('a')
  //   //   link.download = 'downloaded-content.jpg'
  //   //   link.href = dataUrl

  //   //   // Trigger download
  //   //   document.body.appendChild(link)
  //   //   link.click()
  //   //   document.body.removeChild(link)
  //   // } catch (error) {
  //   //   console.error('Error downloading image:', error)
  //   // }
  // }



  const handleDownload = async () => {
    if (!submissionResult?.qrCodeUrl) return

    setIsDownloading(true)
    try {
      // Create canvas with business card dimensions (standard size 3.5 x 2 inches at 300 DPI)
      const canvas = document.createElement('canvas')
      canvas.width = 1086.9 // 3.5 inches * 300 DPI
      canvas.height = 638.1 // 2 inches * 300 DPI
      const ctx = canvas.getContext('2d')

      // Calculate padding (9.3mm = ~110.55 pixels at 300 DPI)
      const padding = 110.55

      // Create background image
      const backgroundImage = new Image()
      backgroundImage.src = cardImage

      return new Promise((resolve, reject) => {
        backgroundImage.onload = () => {
          // Draw background image
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

          // Load and draw QR code
          const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1])
          const svgContent = `<?xml${decodedSvg}`
          const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
          const svgUrl = URL.createObjectURL(svgBlob)

          const qrImage = new Image()
          qrImage.onload = () => {
            // Create temporary canvas for QR code color manipulation
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            tempCanvas.width = qrImage.width
            tempCanvas.height = qrImage.height

            // Fill temporary canvas with light blue background
            tempCtx.fillStyle = '#e2f5fb'
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

            // Draw original QR code to temporary canvas
            tempCtx.drawImage(qrImage, 0, 0)

            // Get image data for color manipulation
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
            const data = imageData.data

            // Replace colors:
            // - Black pixels become #003366
            // - White pixels become #e2f5fb
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                // Black to Navy Blue (#003366)
                data[i] = 0x00 // R: 0
                data[i + 1] = 0x33 // G: 51
                data[i + 2] = 0x66 // B: 102
              } else if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                // White to Light Blue (#e2f5fb)
                data[i] = 0xe2 // R: 226
                data[i + 1] = 0xf5 // G: 245
                data[i + 2] = 0xfb // B: 251
              }
            }

            // Put modified image data back to temporary canvas
            tempCtx.putImageData(imageData, 0, 0)

            // Draw the color-modified QR code
            ctx.drawImage(tempCanvas, padding, 200, 250, 250)

            // Name - using red color and larger font with padding
            ctx.fillStyle = '#FF0000'
            ctx.font = 'bold 48px "Rubik Regular"'
            ctx.fillText(submissionResult.name, padding, 100)

            // Designation with padding
            ctx.fillStyle = '#003366'
            ctx.font = '32px "Rubik Regular"'
            ctx.fillText(`${submissionResult.designation} | Marketing`, padding, 150)

            // Contact details with adjusted positioning
            ctx.fillStyle = '#003366'
            ctx.font = '23px Arial'
            const contactY = 220
            const contentX = padding + 290 // Adjusted for padding + QR code width
            ctx.fillText(
              `${submissionResult.contact} | ${submissionResult.email}`,
              contentX,
              contactY,
            )

            ctx.fillText('One Galle Face Tower, 2208, 1A Centre Road,', contentX, contactY + 30)
            // ctx.fillText(`${submissionResult.address}`, contentX, contactY + 40)
            ctx.fillText('Colombo 002, Sri Lanka', contentX, contactY + 60)

            // Head Office
            ctx.font = 'bold 23px Arial'
            ctx.fillText('Head Office', contentX, contactY + 130)
            ctx.font = '23px Arial'
            ctx.fillText('+94 11 235 2400', contentX , contactY + 170)
            ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', contentX, contactY + 200)
            ctx.fillText('Genting Block, 349565, Singapore', contentX, contactY + 230)

            // Countries text at bottom with bold country codes
            ctx.fillStyle = '#FF0000'
            ctx.font = '24px Arial'
            const countriesY = contactY + 320
            ctx.fillText('Countries Of Operation : ', padding, countriesY)

            // Calculate starting position after the prefix text
            const prefixText = 'Countries Of Operation : '
            const prefixWidth = ctx.measureText(prefixText).width

            // Draw bold country codes
            ctx.font = 'bold 24px Arial'
            const countryCodesX = padding + prefixWidth
            ctx.fillText('SG | MY | VN | LK | MV', countryCodesX, countriesY)

            // Convert to PNG and download
            canvas.toBlob((blob) => {
              if (blob) {
                const link = document.createElement('a')
                const downloadUrl = URL.createObjectURL(blob)
                link.href = downloadUrl
                link.download = `${submissionResult.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}-business-card.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                URL.revokeObjectURL(downloadUrl)
                URL.revokeObjectURL(svgUrl)
                setIsDownloading(false)
                resolve()
              } else {
                reject(new Error('Canvas to Blob conversion failed'))
              }
            }, 'image/png')
          }

          qrImage.onerror = () => {
            reject(new Error('QR code image loading failed'))
            setIsDownloading(false)
          }

          qrImage.src = svgUrl
        }

        backgroundImage.onerror = () => {
          reject(new Error('Background image loading failed'))
          setIsDownloading(false)
        }
      })
    } catch (error) {
      console.error('Download failed:', error)
      setErrors((prev) => ({
        ...prev,
        download: 'Failed to download business card. Please try again.',
      }))
      setIsDownloading(false)
    }
  }
  const handleDownload_old = async () => {
    if (!submissionResult?.qrCodeUrl) return

    setIsDownloading(true)
    try {
      // Create canvas with business card dimensions (standard size 3.5 x 2 inches at 300 DPI)
      const canvas = document.createElement('canvas')
      canvas.width = 1086.9 // 3.5 inches * 300 DPI
      canvas.height = 638.1 // 2 inches * 300 DPI
      const ctx = canvas.getContext('2d')

      // Calculate padding (9.3mm = ~110.55 pixels at 300 DPI)
      const padding = 110.55

      // Create background image
      const backgroundImage = new Image()
      backgroundImage.src = cardImage

      return new Promise((resolve, reject) => {
        backgroundImage.onload = () => {
          // Draw background image
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

          // Load and draw QR code
          const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1])
          const svgContent = `<?xml${decodedSvg}`
          const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
          const svgUrl = URL.createObjectURL(svgBlob)

          const qrImage = new Image()
          qrImage.onload = () => {
            // Create temporary canvas for QR code color manipulation
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            tempCanvas.width = qrImage.width
            tempCanvas.height = qrImage.height

            // Fill temporary canvas with light blue background
            tempCtx.fillStyle = '#e2f5fb'
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

            // Draw original QR code to temporary canvas
            tempCtx.drawImage(qrImage, 0, 0)

            // Get image data for color manipulation
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
            const data = imageData.data

            // Replace colors:
            // - Black pixels become #003366
            // - White pixels become #e2f5fb
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                // Black to Navy Blue (#003366)
                data[i] = 0x00 // R: 0
                data[i + 1] = 0x33 // G: 51
                data[i + 2] = 0x66 // B: 102
              } else if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                // White to Light Blue (#e2f5fb)
                data[i] = 0xe2 // R: 226
                data[i + 1] = 0xf5 // G: 245
                data[i + 2] = 0xfb // B: 251
              }
            }

            // Put modified image data back to temporary canvas
            tempCtx.putImageData(imageData, 0, 0)

            // Draw the color-modified QR code
            ctx.drawImage(tempCanvas, padding, 200, 250, 250)

            // Name - using red color and larger font with padding
            ctx.fillStyle = '#FF0000'
            ctx.font = 'bold 48px "Rubik Regular"'
            ctx.fillText(submissionResult.name, padding, 100)

            // Designation with padding
            ctx.fillStyle = '#003366'
            ctx.font = '32px "Rubik Regular"'
            ctx.fillText(`${submissionResult.designation} | Marketing`, padding, 150)

            // Contact details with adjusted positioning
            ctx.fillStyle = '#003366'
            ctx.font = '24px Arial'
            const contactY = 200
            const contentX = padding + 270 // Adjusted for padding + QR code width
            ctx.fillText(
              `${submissionResult.contact} | ${submissionResult.email}`,
              contentX,
              contactY,
            )

            ctx.fillText('One Galle Face Tower, 2208, 1A Centre Road,', contentX, contactY + 40)
            // ctx.fillText(`${submissionResult.address}`, contentX, contactY + 40)
            ctx.fillText('Colombo 002, Sri Lanka', contentX, contactY + 80)

            // Head Office
            ctx.font = 'bold 24px Arial'
            ctx.fillText('Head Office', contentX, contactY + 140)
            ctx.font = '24px Arial'
            ctx.fillText('+94 11 235 2400', contentX, contactY + 180)
            ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', contentX, contactY + 220)
            ctx.fillText('Genting Block, 349565, Singapore', contentX, contactY + 260)

            // Countries text at bottom with bold country codes
            ctx.fillStyle = '#FF0000'
            ctx.font = '24px Arial'
            const countriesY = contactY + 320
            ctx.fillText('Countries Of Operation : ', padding, countriesY)

            // Calculate starting position after the prefix text
            const prefixText = 'Countries Of Operation : '
            const prefixWidth = ctx.measureText(prefixText).width

            // Draw bold country codes
            ctx.font = 'bold 24px Arial'
            const countryCodesX = padding + prefixWidth
            ctx.fillText('SG | MY | VN | LK | MV', countryCodesX, countriesY)

            // Convert to PNG and download
            canvas.toBlob((blob) => {
              if (blob) {
                const link = document.createElement('a')
                const downloadUrl = URL.createObjectURL(blob)
                link.href = downloadUrl
                link.download = `${submissionResult.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}-business-card.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                URL.revokeObjectURL(downloadUrl)
                URL.revokeObjectURL(svgUrl)
                setIsDownloading(false)
                resolve()
              } else {
                reject(new Error('Canvas to Blob conversion failed'))
              }
            }, 'image/png')
          }

          qrImage.onerror = () => {
            reject(new Error('QR code image loading failed'))
            setIsDownloading(false)
          }

          qrImage.src = svgUrl
        }

        backgroundImage.onerror = () => {
          reject(new Error('Background image loading failed'))
          setIsDownloading(false)
        }
      })
    } catch (error) {
      console.error('Download failed:', error)
      setErrors((prev) => ({
        ...prev,
        download: 'Failed to download business card. Please try again.',
      }))
      setIsDownloading(false)
    }
  }


  const handleDownload1 = async () => {
    if (!submissionResult?.qrCodeUrl) return;

    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1086.9; // 3.5 inches * 300 DPI
      canvas.height = 638.1; // 2 inches * 300 DPI
      const ctx = canvas.getContext('2d');
      const padding = 110.55;

      const backgroundImage = new Image();
      backgroundImage.src = cardImage;

      return new Promise((resolve, reject) => {
        backgroundImage.onload = () => {
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

          const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1]);
          const svgContent = `<?xml${decodedSvg}`;
          const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);

          const qrImage = new Image();
          qrImage.onload = () => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = qrImage.width;
            tempCanvas.height = qrImage.height;

            tempCtx.fillStyle = '#e2f5fb';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(qrImage, 0, 0);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                data[i] = 0x00;
                data[i + 1] = 0x33;
                data[i + 2] = 0x66;
              } else if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                data[i] = 0xe2;
                data[i + 1] = 0xf5;
                data[i + 2] = 0xfb;
              }
            }

            tempCtx.putImageData(imageData, 0, 0);
            ctx.drawImage(tempCanvas, padding, 250, 300, 300); // Adjusted height to 300

            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 48px "Rubik Regular"';
            ctx.fillText(submissionResult.name, padding, 130); // Increased padding for the name

            ctx.fillStyle = '#003366';
            ctx.font = 'bold 32px "Rubik Regular"';
            ctx.fillText(`${submissionResult.designation} | Marketing`, padding, 190); // "Marketing" is now bold

            const contactY = 260;
            const contentX = padding + 310;

            ctx.fillStyle = '#003366';
            ctx.font = '24px Arial';
            ctx.fillText(`${submissionResult.contact} | ${submissionResult.email}`, contentX, contactY);
            ctx.fillText('One Galle Face Tower, 2208, 1A Centre Road,', contentX, contactY + 40);
            ctx.fillText('Colombo 002, Sri Lanka', contentX, contactY + 80);

            ctx.font = 'bold 24px Arial';
            ctx.fillText('Head Office', contentX, contactY + 160); // Added more gap for "Head Office"
            ctx.font = '24px Arial';
            ctx.fillText('+94 11 235 2400', contentX, contactY + 200);
            ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', contentX, contactY + 240);
            ctx.fillText('Genting Block, 349565, Singapore', contentX, contactY + 280);

            ctx.fillStyle = '#FF0000';
            ctx.font = '24px Arial';
            const countriesY = contactY + 340;
            ctx.fillText('Countries Of Operation : ', padding, countriesY);

            const prefixText = 'Countries Of Operation : ';
            const prefixWidth = ctx.measureText(prefixText).width;

            ctx.font = 'bold 24px Arial';
            const countryCodesX = padding + prefixWidth;
            ctx.fillText('SG | MY | VN | LK | MV', countryCodesX, countriesY);

            canvas.toBlob((blob) => {
              if (blob) {
                const link = document.createElement('a');
                const downloadUrl = URL.createObjectURL(blob);
                link.href = downloadUrl;
                link.download = `${submissionResult.name
                  .toLowerCase()
                  .replace(/\s+/g, '-')}-business-card.png`;
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
      setErrors((prev) => ({
        ...prev,
        download: 'Failed to download business card. Please try again.',
      }));
      setIsDownloading(false);
    }
  };




  // const handleDownload = async () => {
  //   if (!submissionResult?.qrCodeUrl) return

  //   setIsDownloading(true)
  //   try {
  //     // Create canvas with business card dimensions (standard size 3.5 x 2 inches at 300 DPI)
  //     const canvas = document.createElement('canvas')
  //     canvas.width = 1086.9 // 3.5 inches * 300 DPI
  //     canvas.height = 638.1 // 2 inches * 300 DPI
  //     const ctx = canvas.getContext('2d')

  //     // Load Rubik font
  //     const loadFont = async () => {
  //       try {
  //         const fontFace = new FontFace(
  //           'Rubik',
  //           'url(https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap)'
  //         )

  //         const fontLoadPromise = Promise.race([
  //           fontFace.load(),
  //           new Promise((_, reject) =>
  //             setTimeout(() => reject(new Error('Font loading timeout')), 3000)
  //           )
  //         ])

  //         await fontLoadPromise
  //         document.fonts.add(fontFace)
  //         return 'Rubik'
  //       } catch (error) {
  //         console.warn('Rubik font loading failed, falling back to system fonts:', error)
  //         return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  //       }
  //     }

  //     // Layout constants
  //     const CARD_PADDING = 110.55 // 9.3mm at 300 DPI
  //     const QR_SIZE = 200
  //     const QR_Y = 180
  //     const NAME_Y = 100
  //     const DESIGNATION_Y = 150
  //     const LINE_HEIGHT = 35
  //     const SECTION_GAP = LINE_HEIGHT * 1.5

  //     // Content positioning
  //     const CONTENT_X = CARD_PADDING + QR_SIZE + 50 // Start of text content after QR code

  //     // Create background image
  //     const backgroundImage = new Image()
  //     backgroundImage.src = cardImage

  //     return new Promise(async (resolve, reject) => {
  //       // Wait for font to load
  //       const fontFamily = await loadFont()

  //       backgroundImage.onload = () => {
  //         // Draw background
  //         ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  //         // Process QR code
  //         const decodedSvg = decodeURIComponent(submissionResult.qrCodeUrl.split('<?xml')[1])
  //         const svgContent = `<?xml${decodedSvg}`
  //         const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
  //         const svgUrl = URL.createObjectURL(svgBlob)

  //         const qrImage = new Image()
  //         qrImage.onload = () => {
  //           // QR code color manipulation
  //           const tempCanvas = document.createElement('canvas')
  //           const tempCtx = tempCanvas.getContext('2d')
  //           tempCanvas.width = qrImage.width
  //           tempCanvas.height = qrImage.height

  //           tempCtx.drawImage(qrImage, 0, 0)
  //           const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  //           const data = imageData.data

  //           // Convert black to navy blue (#003366)
  //           for (let i = 0; i < data.length; i += 4) {
  //             if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
  //               data[i] = 0x00     // R
  //               data[i + 1] = 0x33 // G
  //               data[i + 2] = 0x66 // B
  //             }
  //           }

  //           tempCtx.putImageData(imageData, 0, 0)

  //           // Draw the colored QR code
  //           ctx.drawImage(tempCanvas, CARD_PADDING, QR_Y, QR_SIZE, QR_SIZE)

  //           // Draw name
  //           ctx.fillStyle = '#FF0000'
  //           ctx.font = `bold 48px ${fontFamily}`
  //           ctx.textBaseline = 'middle'
  //           ctx.fillText(submissionResult.name, CARD_PADDING, NAME_Y)

  //           // Draw designation
  //           ctx.fillStyle = '#003366'
  //           ctx.font = `32px ${fontFamily}`
  //           ctx.fillText(`${submissionResult.designation} | Marketing`, CARD_PADDING, DESIGNATION_Y)

  //           // Contact details section
  //           ctx.fillStyle = '#003366'
  //           ctx.font = '24px Arial'
  //           let currentY = QR_Y

  //           // Contact and email (aligned with QR code top)
  //           ctx.fillText(
  //             `${submissionResult.contact} | ${submissionResult.email}`,
  //             CONTENT_X,
  //             currentY
  //           )
  //           currentY += LINE_HEIGHT

  //           // Office address
  //           ctx.fillText(`${submissionResult.office_address}`, CONTENT_X, currentY)
  //           currentY += LINE_HEIGHT
  //           ctx.fillText('Colombo 002, Sri Lanka', CONTENT_X, currentY)
  //           currentY += SECTION_GAP

  //           // Head Office section
  //           ctx.font = 'bold 24px Arial'
  //           ctx.fillText('Head Office', CONTENT_X, currentY)
  //           currentY += LINE_HEIGHT

  //           ctx.font = '24px Arial'
  //           ctx.fillText('+94 11 235 2400', CONTENT_X, currentY)
  //           currentY += LINE_HEIGHT
  //           ctx.fillText('80, Genting Lane, Ruby Industrial Complex,', CONTENT_X, currentY)
  //           currentY += LINE_HEIGHT
  //           ctx.fillText('Genting Block, 349565, Singapore', CONTENT_X, currentY)
  //           currentY += SECTION_GAP

  //           // Countries section at bottom
  //           ctx.fillStyle = '#FF0000'
  //           ctx.font = '24px Arial'
  //           const prefixText = 'Countries Of Operation : '
  //           const prefixWidth = ctx.measureText(prefixText).width

  //           // Calculate vertical position for countries section
  //           const countriesY = QR_Y + QR_SIZE + LINE_HEIGHT
  //           ctx.fillText(prefixText, CARD_PADDING, countriesY)

  //           // Draw country codes in bold
  //           ctx.font = 'bold 24px Arial'
  //           ctx.fillText('SG | MY | VN | LK | MV', CARD_PADDING + prefixWidth, countriesY)

  //           // Convert to PNG and trigger download
  //           canvas.toBlob((blob) => {
  //             if (blob) {
  //               const link = document.createElement('a')
  //               const downloadUrl = URL.createObjectURL(blob)
  //               link.href = downloadUrl
  //               link.download = `${submissionResult.name
  //                 .toLowerCase()
  //                 .replace(/\s+/g, '-')}-business-card.png`
  //               document.body.appendChild(link)
  //               link.click()
  //               document.body.removeChild(link)

  //               URL.revokeObjectURL(downloadUrl)
  //               URL.revokeObjectURL(svgUrl)
  //               setIsDownloading(false)
  //               resolve()
  //             } else {
  //               reject(new Error('Canvas to Blob conversion failed'))
  //             }
  //           }, 'image/png')
  //         }

  //         qrImage.onerror = () => {
  //           reject(new Error('QR code image loading failed'))
  //           setIsDownloading(false)
  //         }

  //         qrImage.src = svgUrl
  //       }

  //       backgroundImage.onerror = () => {
  //         reject(new Error('Background image loading failed'))
  //         setIsDownloading(false)
  //       }
  //     })
  //   } catch (error) {
  //     console.error('Download failed:', error)
  //     setErrors((prev) => ({
  //       ...prev,
  //       download: 'Failed to download business card. Please try again.',
  //     }))
  //     setIsDownloading(false)
  //   }
  // }

  const [sortConfig, setSortConfig] = useState({
    key: 'updated_at',
    direction: 'desc',
  })

  // Add sorting function
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === 'updated_at') {
        const dateA = new Date(a[key] || 0)
        const dateB = new Date(b[key] || 0)
        return direction === 'asc' ? dateA - dateB : dateB - dateA
      }

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Handle sort click
  const handleSort = (key) => {
    let direction = 'desc'
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'
    }
    setSortConfig({ key, direction })
  }

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  // Update useEffect for filtered users to include sorting
  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase()
      filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTermLower) ||
          user.email.toLowerCase().includes(searchTermLower) ||
          user.designation.toLowerCase().includes(searchTermLower),
      )
    }

    // Apply sorting
    filtered = sortData(filtered, sortConfig.key, sortConfig.direction)

    setFilteredUsers(filtered)
  }, [searchTerm, users, sortConfig])

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Update modal close handlers
  const handleCloseEditModal = () => {
    setShowEditModal(false)
    clearFormData()
  }

  return (
    <div className="container-lg">
      <CCard className="mb-4">
        <CCardHeader>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink active={activeTab === 1} onClick={() => handleTabChange(1)}>
                New Invitation
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 2} onClick={() => handleTabChange(2)}>
                All Invitations
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 1}>
              {!submissionResult ? (
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

                    {/* <CCol md={6}>
                      <div>
                        <CFormLabel>Contact</CFormLabel>
                        <div
                          className={`phone-input-wrapper ${errors.contact ? 'is-invalid' : ''}`}
                        >
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="LK"
                            value={formData.contact}
                            onChange={handlePhoneChange}
                            className={errors.contact ? 'is-invalid' : ''}
                          />
                          {errors.contact && (
                            <div className="invalid-feedback">{errors.contact}</div>
                          )}
                        </div>
                      </div>
                    </CCol> */}
                    <style jsx>{`
                      .phone-input-wrapper {
                        position: relative;
                      }

                      .phone-input-wrapper .PhoneInput {
                        display: flex;
                        align-items: center;
                        border: 1px solid #b1b7c1;
                        border-radius: 4px;
                        padding: 0.375rem 0.75rem;
                        background-color: #fff;
                      }

                      .phone-input-wrapper.is-invalid .PhoneInput {
                        border-color: #dc3545;
                        padding-right: calc(1.5em + 0.75rem);
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
                        background-repeat: no-repeat;
                        background-position: right calc(0.375em + 0.1875rem) center;
                        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
                      }

                      .phone-input-wrapper .PhoneInputInput {
                        border: none;
                        padding: 0;
                        margin-left: 0.5rem;
                        flex: 1;
                        min-width: 0;
                        background: none;
                        font-size: 1rem;
                        line-height: 1.5;
                        color: #212529;
                      }

                      .phone-input-wrapper .PhoneInputInput:focus {
                        outline: none;
                        box-shadow: none;
                      }

                      /* Add these new styles for the flag and country select */
                      .phone-input-wrapper .PhoneInputCountry {
                        display: flex;
                        align-items: center;
                        position: relative;
                        margin-right: 0.5rem;
                      }

                      .phone-input-wrapper .PhoneInputCountryIcon {
                        margin-right: 0.5rem;
                      }

                      .phone-input-wrapper .PhoneInputCountrySelect {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        z-index: 1;
                        border: 0;
                        opacity: 0;
                        cursor: pointer;
                      }

                      .phone-input-wrapper .invalid-feedback {
                        display: block;
                        width: 100%;
                        margin-top: 0.25rem;
                        font-size: 0.875em;
                        color: #dc3545;
                      }
                    `}</style>

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
                              <input
                                type="file"
                                hidden
                                onChange={handlePhotoChange}
                                accept="image/*"
                              />
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
                        {qrCodeDisplayUrl && (
                          <>
                            <CImage
                              src={qrCodeDisplayUrl}
                              alt="QR Code"
                              className="mw-100 h-auto mb-3"
                            />
                            <div>
                              <CButton
                                color="primary"
                                onClick={handleDownload}
                                disabled={isDownloading}
                              >
                                {isDownloading ? (
                                  <>
                                    <CSpinner size="sm" className="me-2" />
                                    Converting...
                                  </>
                                ) : (
                                  'Download Business Card (PNG)'
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
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              <CRow className="mb-4">
                <CCol md={6} className="ms-auto">
                  <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                      placeholder="Search by name, email, or designation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {loading ? (
                <div className="text-center p-4">
                  <CSpinner />
                </div>
              ) : filteredUsers.length > 0 ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Designation</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Contact</CTableHeaderCell>
                      <CTableHeaderCell>Last Updated</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredUsers.map((user) => (
                      <CTableRow key={user.email}>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.designation}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{user.contact}</CTableDataCell>
                        <CTableDataCell>{formatDate(user.updated_at)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CButton color="info" size="sm" onClick={() => handleViewDetails(user)}>
                              Show
                            </CButton>
                            <CButton color="primary" size="sm" onClick={() => handleEdit(user)}>
                              Edit
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted">
                    {users.length === 0
                      ? 'No invitations found.'
                      : 'No results found for your search.'}
                  </p>
                </div>
              )}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* View Details Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <CRow>
              <CCol md={7}>
                <div className="mb-3">
                  <CImage
                    rounded
                    thumbnail
                    src={preview || selectedUser?.photo}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    alt="User Photo"
                  />
                </div>
                <div className="mb-3">
                  <strong className="me-2">Name:</strong>
                  {selectedUser.name}
                </div>
                <div className="mb-3">
                  <strong className="me-2">Designation:</strong>
                  {selectedUser.designation}
                </div>
                <div className="mb-3">
                  <strong className="me-2">Email:</strong>
                  {selectedUser.email}
                </div>
                <div className="mb-3">
                  <strong className="me-2">Contact:</strong>
                  {selectedUser.contact}
                </div>
                <div className="mb-3">
                  <strong className="me-2">WhatsApp:</strong>
                  {selectedUser.whatsapp}
                </div>
                <div className="mb-3">
                  <strong className="me-2">Office Address:</strong>
                  {selectedUser.office_address}
                </div>
                {selectedUser.info && (
                  <div className="mb-3">
                    <strong className="me-2">Additional Info:</strong>
                    {selectedUser.info}
                  </div>
                )}
              </CCol>
              <CCol md={5} className="text-center border-start">
                <h5 className="mb-3">QR Code</h5>
                {selectedUser.qr_code_path && (
                  <>
                    <div className="mb-3">
                      <CImage src={qrCodeDisplayUrl} alt="QR Code" className="img-fluid" />
                    </div>
                    <CButton
                      color="primary"
                      size="sm"
                      onClick={() => handleDownload(selectedUser)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Converting...
                        </>
                      ) : (
                        'Download Business Card'
                      )}
                    </CButton>
                  </>
                )}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={showEditModal} onClose={handleCloseEditModal} size="xl">
        <CModalHeader>
          <CModalTitle>Edit User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={8}>
              <CForm>
                <CRow className="g-3">
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
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput
                        type="text"
                        name="email"
                        value={formData.email}
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
                            Upload New Photo
                            <input
                              type="file"
                              hidden
                              onChange={handlePhotoChange}
                              accept="image/*"
                            />
                          </CButton>
                          {errors.photo && (
                            <div className="text-danger small mt-1">{errors.photo}</div>
                          )}
                        </div>
                        {(preview || selectedUser?.photo) && (
                          <CImage
                            rounded
                            thumbnail
                            src={preview || selectedUser?.photo}
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
              </CForm>
            </CCol>
            <CCol md={4} className="border-start">
              <QRCodeDisplay
                title="Current QR Code"
                qrCodeUrl={qrCodeDisplayUrl}
                showDownloadButton={false}
              />
              {/* <p className="text-muted small text-center">
                QR code will be automatically updated if you change the email address.
              </p> */}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseEditModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default UserInvitation
