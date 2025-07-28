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
  CImage
} from '@coreui/react';
import axios from 'axios';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState({
    image: '',
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
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBanner({
      ...currentBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`/banners/${currentBanner.id}`, currentBanner);
      } else {
        await axios.post('/banners', currentBanner);
      }
      setModalVisible(false);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const openCreateModal = () => {
    setCurrentBanner({
      image: '',
      route: '',
      title: '',
      description: '',
      is_active: true,
      sort_order: 0,
      nationality: '',
      product_id: '',
      category: 'Lifestyles'
    });
    setIsEdit(false);
    setModalVisible(true);
  };

  const openEditModal = (banner) => {
    setCurrentBanner({
      ...banner,
      product_id: banner.data_set?.product_id || '',
      category: banner.data_set?.category || 'Lifestyles'
    });
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
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
          </CCardBody>
        </CCard>
      </CCol>

      {/* Create/Edit Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>{isEdit ? 'Edit Banner' : 'Create New Banner'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel>Image URL</CFormLabel>
              <CFormInput
                type="text"
                name="image"
                value={currentBanner.image}
                onChange={handleInputChange}
                placeholder="https://example.com/banner.jpg"
                required
              />
              {currentBanner.image && (
                <div className="mt-2">
                  <CImage src={currentBanner.image} width={150} thumbnail />
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <CFormLabel>Route</CFormLabel>
              <CFormInput
                type="text"
                name="route"
                value={currentBanner.route}
                onChange={handleInputChange}
                placeholder="Route name"
                required
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <CFormLabel>Product ID</CFormLabel>
                <CFormInput
                  type="number"
                  name="product_id"
                  value={currentBanner.product_id}
                  onChange={handleInputChange}
                  placeholder="Product ID"
                  required
                />
              </div>
              <div className="col-md-6">
                <CFormLabel>Category</CFormLabel>
                <CFormSelect
                  name="category"
                  value={currentBanner.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Essentials">Essentials</option>
                  <option value="Non-Essentials">Non-Essentials</option>
                  <option value="Lifestyles">Lifestyles</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Education">Education</option>
                </CFormSelect>
              </div>
            </div>
            
            <div className="mb-3">
              <CFormLabel>Title</CFormLabel>
              <CFormInput
                type="text"
                name="title"
                value={currentBanner.title}
                onChange={handleInputChange}
                placeholder="Banner title"
                required
              />
            </div>
            
            <div className="mb-3">
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                name="description"
                value={currentBanner.description}
                onChange={handleInputChange}
                placeholder="Banner description"
                rows={3}
                required
              />
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <CFormLabel>Sort Order</CFormLabel>
                <CFormInput
                  type="number"
                  name="sort_order"
                  value={currentBanner.sort_order}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <CFormLabel>Nationality</CFormLabel>
                <CFormInput
                  type="text"
                  name="nationality"
                  value={currentBanner.nationality}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <CFormCheck
                label="Active Banner"
                name="is_active"
                checked={currentBanner.is_active}
                onChange={handleInputChange}
              />
            </div>
            
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
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