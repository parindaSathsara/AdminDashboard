import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CImage,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import axios from 'axios';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalBanners, setTotalBanners] = useState(0);
  const [countries, setCountries] = useState([]);

  const [currentBanner, setCurrentBanner] = useState({
    id: null,
    route: '',
    title: '',
    description: '',
    is_active: true,
    sort_order: 0,
    nationality: '',
    product_id: '',
    category: 'Lifestyles'
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchCountries();
  }, [currentPage]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`/banners?page=${currentPage}&per_page=${perPage}`);
      setBanners(response.data.data);
      setTotalBanners(response.data.total);
    } catch (error) {
      console.error('Error fetching banners:', error);
      showError('Failed to fetch banners');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentBanner.route) newErrors.route = 'Route is required';
    if (!currentBanner.title) newErrors.title = 'Title is required';
    if (!currentBanner.description) newErrors.description = 'Description is required';
    if (!currentBanner.product_id) newErrors.product_id = 'Product ID is required';
    if (!currentBanner.category) newErrors.category = 'Category is required';
    if (!isEdit && !imageFile) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setCurrentBanner({
      ...currentBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const showError = (message) => {
    setSuccessMessage('');
    alert(message);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Explicitly append all fields
      formData.append('route', currentBanner.route);
      formData.append('title', currentBanner.title);
      formData.append('description', currentBanner.description);
      formData.append('is_active', currentBanner.is_active ? '1' : '0');
      formData.append('sort_order', currentBanner.sort_order);
      formData.append('nationality', currentBanner.nationality || '');
      formData.append('product_id', currentBanner.product_id);
      formData.append('category', currentBanner.category);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const url = isEdit
        ? `/banners/${currentBanner.id}`
        : '/banners';

      const response = isEdit
        ? await axios.post(url, formData, config)
        : await axios.post(url, formData, config);

      showSuccess(response.data.message);
      setModalVisible(false);
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      if (error.response?.data?.error) {
        const errorMsg = typeof error.response.data.error === 'string'
          ? error.response.data.error
          : Object.values(error.response.data.error).join(', ');
        showError(errorMsg);
      } else {
        showError('An error occurred while saving the banner');
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentBanner({
      id: null,
      route: '',
      title: '',
      description: '',
      is_active: true,
      sort_order: 0,
      nationality: '',
      product_id: '',
      category: 'Lifestyles'
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setIsEdit(false);
    setModalVisible(true);
  };

  const openEditModal = (banner) => {
    setCurrentBanner({
      id: banner.id,
      route: banner.route,
      title: banner.title,
      description: banner.description,
      is_active: banner.is_active,
      sort_order: banner.sort_order,
      nationality: banner.nationality || '',
      product_id: banner.data_set?.product_id || '',
      category: banner.data_set?.category || 'Lifestyles'
    });
    setImageFile(null);
    setImagePreview(banner.image);
    setErrors({});
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const response = await axios.delete(`/banners/${id}`);
        showSuccess(response.data.message);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        showError(error.response?.data?.error || 'Failed to delete banner');
      }
    }
  };

  const totalPages = Math.ceil(totalBanners / perPage);

  return (
    <CRow>
      <CCol xs={12}>
        {successMessage && (
          <CAlert color="success" dismissible onClose={() => setSuccessMessage('')}>
            {successMessage}
          </CAlert>
        )}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Banners Management</strong>
            <CButton color="primary" className="float-end" onClick={openCreateModal}>
              <CIcon icon={cilPlus} className="me-2" />
              Create New Banner
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Image</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Route</CTableHeaderCell>
                  <CTableHeaderCell>Data Set</CTableHeaderCell>
                  <CTableHeaderCell>Active</CTableHeaderCell>
                  <CTableHeaderCell>Sort Order</CTableHeaderCell>
                  <CTableHeaderCell>Nationality</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {banners.map((banner) => (
                  <CTableRow key={banner.id}>
                    <CTableDataCell>{banner.id}</CTableDataCell>
                    <CTableDataCell>
                      <CImage
                        src={banner.image}
                        alt={banner.title}
                        width={100}
                        thumbnail
                      />
                    </CTableDataCell>
                    <CTableDataCell>{banner.title}</CTableDataCell>
                    <CTableDataCell className="text-truncate" style={{ maxWidth: '200px' }}>
                      {banner.description}
                    </CTableDataCell>
                    <CTableDataCell>{banner.route}</CTableDataCell>
                    <CTableDataCell>
                      <small>
                        {banner.data_set?.category}: {banner.data_set?.product_id}
                      </small>
                    </CTableDataCell>
                    <CTableDataCell>
                      {banner.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{banner.sort_order}</CTableDataCell>
                    <CTableDataCell>{banner.nationality || 'All'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(banner)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {totalPages > 1 && (
              <CPagination className="mt-3" aria-label="Page navigation">
                <CPaginationItem 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(1)}
                >
                  First
                </CPaginationItem>
                <CPaginationItem 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <CPaginationItem
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}
                
                <CPaginationItem 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
                <CPaginationItem 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Last
                </CPaginationItem>
              </CPagination>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Create/Edit Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static" keyboard={false}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>{isEdit ? 'Edit Banner' : 'Create New Banner'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel>Banner Image {!isEdit && <span className="text-danger">*</span>}</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className={errors.image ? 'is-invalid' : ''}
              />
              {errors.image && <div className="invalid-feedback">{errors.image}</div>}

              {imagePreview && (
                <div className="mt-2">
                  <CImage src={imagePreview} width={150} thumbnail />
                  <p className="text-muted small mt-1">
                    {isEdit ? 'New image will replace existing one' : 'Preview'}
                  </p>
                </div>
              )}
              {!imagePreview && isEdit && (
                <div className="mt-2">
                  <CImage src={currentBanner.image} width={150} thumbnail />
                  <p className="text-muted small mt-1">Current image</p>
                </div>
              )}
            </div>
              <style>
    {`
      .modal-body .form-control {
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
      }
    `}
  </style>

            <div className="mb-3">
              <CFormLabel>Route <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="route"
                value={currentBanner.route}
                onChange={handleInputChange}
                placeholder="Route name"
                disabled={loading}
                className={errors.route ? 'is-invalid' : ''}
                
              />
              {errors.route && <div className="invalid-feedback">{errors.route}</div>}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <CFormLabel>Product ID <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  name="product_id"
                  value={currentBanner.product_id}
                  onChange={handleInputChange}
                  placeholder="Product ID"
                  disabled={loading}
                  className={errors.product_id ? 'is-invalid' : ''}
                />
                {errors.product_id && <div className="invalid-feedback">{errors.product_id}</div>}
              </div>
              <div className="col-md-6">
                <CFormLabel>Category <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="category"
                  value={currentBanner.category}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.category ? 'is-invalid' : ''}
                >
                  <option value="Essentials">Essentials</option>
                  <option value="Non-Essentials">Non-Essentials</option>
                  <option value="Lifestyles">Lifestyles</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Education">Education</option>
                </CFormSelect>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>
            </div>

            <div className="mb-3">
              <CFormLabel>Title <span className="text-danger">*</span></CFormLabel>
              <CFormInput
                type="text"
                name="title"
                value={currentBanner.title}
                onChange={handleInputChange}
                placeholder="Banner title"
                disabled={loading}
                className={errors.title ? 'is-invalid' : ''}
                
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <CFormLabel>Description <span className="text-danger">*</span></CFormLabel>
              <CFormTextarea
                name="description"
                value={currentBanner.description}
                onChange={handleInputChange}
                placeholder="Banner description"
                rows={3}
                disabled={loading}
                className={errors.description ? 'is-invalid' : ''}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <CFormLabel>Sort Order</CFormLabel>
                <CFormInput
                  type="number"
                  name="sort_order"
                  value={currentBanner.sort_order}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="col-md-6">
                <CFormLabel>Nationality</CFormLabel>
                <CFormSelect
                  name="nationality"
                  value={currentBanner.nationality}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </div>

            <div className="mb-3">
              <CFormCheck
                label="Active Banner"
                name="is_active"
                checked={currentBanner.is_active}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => setModalVisible(false)}
                disabled={loading}
              >
                Cancel
              </CButton>
              <CButton
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading && <CSpinner size="sm" className="me-1" />}
                {isEdit ? 'Update Banner' : 'Create Banner'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default Banners;