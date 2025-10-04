import {
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const ListBlogs = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/fetchBlogs')
      setBlogs(res.data.data)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching Blogs!',
      })
      console.error('Error fetching blogs:', err)
    }
  }

  return (
    <div>
    <CContainer>
  {blogs.length === 0 ? (
    <div className="text-center py-5">
      <h5 className="text-muted">There is no blog available right now.</h5>
    </div>
  ) : (
    <CRow xs={{ cols: 1 }} sm={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }}>
      {blogs.map((blog, index) => (
        <CCol key={index}>
          <Link to={`/blogs/listBlogs/viewBlog/${blog.id}`}>
            <CCard style={{ width: '18rem', margin: '1rem' }}>
              <CCardImage
                orientation="top"
                style={{ height: '12rem' }}
                src={
                  blog.images
                    ? blog.images.split(',')[0]
                    : 'https://as2.ftcdn.net/jpg/04/99/93/31/1000_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'
                }
              />
              <CCardBody style={{ height: '14rem' }}>
                <CCardTitle>{blog.title || 'Title not available...'}</CCardTitle>
                <CCardText>
                  {blog.summary
                    ? blog.summary.substring(0, 100) + (blog.summary.length > 100 ? '...' : '')
                    : 'Summary not available...'}
                </CCardText>
              </CCardBody>
            </CCard>
          </Link>
        </CCol>
      ))}
    </CRow>
  )}
</CContainer>

    </div>
  )
}

export default ListBlogs
