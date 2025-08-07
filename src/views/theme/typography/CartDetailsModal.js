import axios from 'axios'
import React, { useState, useMemo, useEffect } from 'react'
import { Button, Modal, Form, Card, ListGroup, Badge, Alert, Spinner, InputGroup } from 'react-bootstrap'
import { FaFilePdf, FaFileWord, FaShoppingCart, FaDownload, FaSearch } from 'react-icons/fa'
import { saveAs } from 'file-saver'

const CartDetailsModal = ({ showModal, handleCloseModal, selectedCustomer, cartData }) => {
  const [selectedCarts, setSelectedCarts] = useState([])
  const [shippingCharges, setShippingCharges] = useState('')
  const [cartDiscount, setCartDiscount] = useState('')
  const [cartCurrency, setCartCurrency] = useState('')
  const [loading, setLoading] = useState({ pdf: false, word: false, quotation: false })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    axios.get('/get-currency')
      .then(res => {
        if (res.data.status === 'success') {
          setCurrencyOptions(res.data.codes);
        }
      })
      .catch(err => {
        console.error("Failed to fetch currencies:", err);
      });
  }, []);

  // Filter carts based on search term
  const filteredCarts = useMemo(() => {
    if (!cartData?.cart_titles) return [];
    return cartData.cart_titles.filter(cart =>
      cart.cart_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.cart_id.toString().includes(searchTerm)
    );
  }, [cartData, searchTerm]);

  const hasCarts = cartData?.cart_titles?.length > 0;

  const handleCartSelection = (cart) => {
    if (selectedCarts.some((c) => c.cart_id === cart.cart_id)) {
      setSelectedCarts(selectedCarts.filter((c) => c.cart_id !== cart.cart_id))
    } else {
      setSelectedCarts([...selectedCarts, cart])
    }
  }

  const handleDownload = async (type) => {
    // Validate selections
    if (selectedCarts.length === 0) {
      setError('Please select at least one cart')
      return
    }

    if (!cartCurrency) {
      setError('Please select a currency')
      return
    }

    // Convert to number
    const shipping = shippingCharges ? parseFloat(shippingCharges) : 0
    const discount = cartDiscount ? parseFloat(cartDiscount) : 0

    // Check for NaN
    if (isNaN(shipping) || isNaN(discount)) {
      setError('Shipping Charges and Discount must be valid numbers')
      return
    }

    setLoading(prev => ({ ...prev, [type]: true }))
    setError(null)
    setSuccess(null)

    const payload = {
      cartIds: selectedCarts.map((cart) => cart.cart_id),
      shipping: shipping,
      price_discount: discount,
      currency: cartCurrency,
    }

    let endpoint = ''
    if (type === 'word') {
      endpoint = 'getCartByCustomerId_word'
    } else if (type === 'pdf') {
      endpoint = 'getCartByCustomerId_pdf'
    } else if (type === 'quotation_pdf') {
      endpoint = 'summary-quatation/pdf'
    }
    else if (type === 'quotation_word') {
      endpoint = 'summary-quatation/word'
    }


    try {
      const response = await axios.post(endpoint, payload, {
        responseType: 'blob',
      })


      const contentType = response.headers['content-type']

      if (contentType.includes('application/json')) {
        const text = await new Response(response.data).text()
        try {
          const jsonResponse = JSON.parse(text)
          throw new Error(jsonResponse.message || 'Please check the cart - The cart may be empty')
        } catch (e) {
          throw new Error('Please check the cart - The cart may be empty')
        }
      }

    
      let filename = '';
      if (type === 'quotation_pdf' || type === 'quotation_word') {
        filename = `quotation_details.${type === 'quotation_pdf' ? 'pdf' : 'docx'}`;
      } else {
        filename = `cart_details.${type === 'quotation' ? 'pdf' : type}`;
      }

      const contentDisposition = response.headers['content-disposition'] || `attachment; filename="${filename}"`;

      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/i)
        if (match && match[1]) {
          filename = decodeURIComponent(match[1])
        }
      }

      saveAs(response.data, filename)
      setSuccess(`File downloaded successfully!`)
      resetModal()
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const text = await new Response(error.response.data).text()
        try {
          const errorResponse = JSON.parse(text)
          setError(errorResponse.message || 'Please check the cart - The cart may be empty')
        } catch (e) {
          setError('Please check the cart - The cart may be empty')
        }
      } else {
        setError(error.message || 'Please check the cart - The cart may be empty')
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  const resetModal = () => {
    setSelectedCarts([])
    setShippingCharges('')
    setCartDiscount('')
    setCartCurrency('')
    setError(null)
    setSuccess(null)
    setLoading({ pdf: false, word: false, quotation: false })
    // setSearchTerm('')
  }

  const handleClose = () => {
    resetModal()
    handleCloseModal()
  }

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaShoppingCart className="me-2" />
          Cart Details - {selectedCustomer?.username || 'Customer'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Error/Success Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}

        {/* Always show search box if there are carts */}
        {hasCarts && (
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Available Carts</h5>
                  <small className="text-muted">Select one or more carts to process</small>
                </div>
               <InputGroup style={{ width: '300px' }}>
  <Form.Control
    placeholder="Search carts..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  {searchTerm && (
    <InputGroup.Text
      style={{ cursor: 'pointer' }}
      onClick={() => setSearchTerm('')}
    >
      ✕
    </InputGroup.Text>
  )}
  <InputGroup.Text>
    <FaSearch />
  </InputGroup.Text>
</InputGroup>

              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {/* Show cart list or empty message */}
              {filteredCarts.length > 0 ? (
                <ListGroup variant="flush">
                  {filteredCarts.map((cart) => (
                    <ListGroup.Item
                      key={cart.cart_id}
                      action
                      active={selectedCarts.some((c) => c.cart_id === cart.cart_id)}
                      onClick={() => handleCartSelection(cart)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{cart.cart_title}</span>
                      <Badge bg="secondary">ID: {cart.cart_id}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted text-center">
                  {searchTerm ? "No carts match your search" : "No carts available"}
                </p>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Show "no carts" message only when there are truly no carts */}
        {!hasCarts && (
          <div className="text-center py-4">
            <p className="text-muted">No carts available for this customer.</p>
          </div>
        )}

        {/* Additional controls (always shown if carts exist) */}
        {hasCarts && (
          <>
            <div className="row mb-3">
              <div className="col-md-4">
                <Form.Group controlId="shippingCharges">
                  <Form.Label>Shipping Charges</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={shippingCharges}
                    onChange={(e) => setShippingCharges(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="cartDiscount">
                  <Form.Label>Total Discount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={cartDiscount}
                    onChange={(e) => setCartDiscount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="cartCurrency">
                  <Form.Label>
                    Currency <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={cartCurrency}
                    onChange={(e) => setCartCurrency(e.target.value)}
                    required
                  >
                    <option value="">Select Currency</option>
                    {currencyOptions.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            {selectedCarts.length > 0 && (
              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">Selected Carts ({selectedCarts.length})</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedCarts.map((cart) => (
                      <Badge key={cart.cart_id} bg="primary" pill>
                        {cart.cart_title} (ID: {cart.cart_id})
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button variant="outline-danger" className="me-2" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-secondary" onClick={resetModal} disabled={Object.values(loading).some(Boolean)}>
            Clear Selection
          </Button>
        </div>
        <div>
          <Button
            variant="success"
            className="me-2"
            onClick={() => handleDownload('pdf')}
            disabled={loading.pdf || loading.word || loading.quotation || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading.pdf ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFilePdf className="me-1" /> Download PDF
              </>
            )}
          </Button>
          <Button
            variant="primary"
            className="me-2"
            onClick={() => handleDownload('word')}
            disabled={loading.word || loading.pdf || loading.quotation || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading.word ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFileWord className="me-1" /> Download Word
              </>
            )}
          </Button>
          <Button
            variant="primary"
            className="me-2"
            onClick={() => handleDownload('quotation_pdf')}
            disabled={loading.quotation || loading.pdf || loading.word || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading.quotation ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFilePdf className="me-1" /> Quotation PDF
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleDownload('quotation_word')}
            disabled={loading.quotation || loading.pdf || loading.word || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading.quotation ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFilePdf className="me-1" /> Quotation Word
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CartDetailsModal
