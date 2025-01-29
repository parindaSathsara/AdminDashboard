import { useNavigate, useParams } from 'react-router-dom'
import BlogCarousel from './BlogCarousel'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { CButton, CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/react'
import { UserLoginContext } from 'src/Context/UserLoginContext';

function ViewBlog() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
   const { userData } = useContext(UserLoginContext);

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/getBlog/${id}`)
      .then((res) => {
        setData(res.data.data)
        setLoading(false) // Set loading to false when the data is fetched
      })
      .catch((err) => {
        setLoading(false) // Set loading to false if an error occurs
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching Blog!',
        })
      })
  }, [id])

  function handleDelete() {
    setLoading(true)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/deleteBlog/${id}`)
          .then((res) => {
            navigate('/blogs/listBlogs')
          })
          .catch((err) => {
            setLoading(false)
            console.log(err)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error deleting blog!',
            })
          })
      }
    })
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CSpinner size="sm" className="me-2" />
        <h4>Loading blog...</h4>
      </div>
    )
  }

  return (
    <div>
      {data && (
        <>
          <div className="title" style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{data.title}</h1>
          </div>
          <br />
          <BlogCarousel images={data.images} />
          <br />
          <CCard style={{ padding: '1rem' }}>
            <CCardHeader class="fs-4">Description</CCardHeader>
            <CCardBody>
          <div dangerouslySetInnerHTML={{ __html: data.text }} />

            </CCardBody>

          </CCard>
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
      {
        userData?.permissions?.includes("remove blog") &&
        <CButton style={{ color: '#ffffff' }} onClick={handleDelete} color="danger">
          Delete
        </CButton>
   }
      </div>
    </div>
  )
}

export default ViewBlog
