import axios from 'axios'
import React, { useState } from 'react'
import { Button, Modal, Form, Card, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap'
import { FaFilePdf, FaFileWord, FaShoppingCart, FaDownload } from 'react-icons/fa'
import { saveAs } from 'file-saver'

const CartDetailsModal = ({ showModal, handleCloseModal, selectedCustomer, cartData }) => {
  const [selectedCarts, setSelectedCarts] = useState([])
  const [shippingCharges, setShippingCharges] = useState('')
  const [cartDiscount, setCartDiscount] = useState('')
  const [cartCurrency, setCartCurrency] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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

    setLoading(true)
    setError(null)
    setSuccess(null)

    const payload = {
      cartIds: selectedCarts.map((cart) => cart.cart_id),
      // cartIds: [675],
      shipping: shipping,
      price_discount: discount,
      currency: cartCurrency,
      // document_type: type, // 'pdf' or 'word'
    }
  if (type === 'word') {
   axios
        .post('getCartByCustomerId_word', payload, {
          responseType: 'blob', 
        })
        .then((response) => {
          
          const contentType = response.headers['content-type']

          if (contentType.includes('application/json')) {
           
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const jsonResponse = JSON.parse(reader.result)
                // setError(jsonResponse.message || 'No cart data available for download')
                setError('Please check the cart-The cart may be empty')
              } catch (e) {
                setError('Please check the cart-The cart may be empty')
              }
            }
            reader.readAsText(response.data)
          } else {
            
            const filename = response.headers['content-disposition']
              ? response.headers['content-disposition'].split('filename=')[1]
              : `cart_details.${type}`

            saveAs(response.data, filename)
            setSuccess(`File downloaded successfully!`)
            resetModal()
          }
        })
        .catch((error) => {
          if (error.response && error.response.data instanceof Blob) {
            // Handle JSON error responses sent as Blob
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const errorResponse = JSON.parse(reader.result)
                setError('Please check the cart-The cart may be empty')
              } catch (e) {
                setError('Please check the cart-The cart may be empty')
              }
            }
            reader.readAsText(error.response.data)
          } else {
            // setError(error.message || 'Failed to download file')
            setError('Please check the cart-The cart may be empty')
          }
        })
        .finally(() => {
          setLoading(false)
        })
} else if (type === 'pdf') {
      axios
        .post('getCartByCustomerId_pdf', payload, {
          responseType: 'blob', 
        })
        .then((response) => {
    const contentType = response.headers['content-type'];

    if (contentType.includes('application/json')) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonResponse = JSON.parse(reader.result);
          setError('Please check the cart-The cart may be empty');
        } catch (e) {
          setError('Please check the cart-The cart may be empty');
        }
      };
      reader.readAsText(response.data);
    } else {
      // ✅ Extract filename properly
      let filename = 'cart_details.pdf';
      console.log(response.headers.get(),"headersssssxxxxx");
      const contentDisposition = response.headers['content-disposition'];
      
      console.log('Content-Disposition:', contentDisposition);
      

      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      saveAs(response.data, filename);
      setSuccess(`File downloaded successfully!`);
      resetModal();
    }
  })
        .catch((error) => {
          if (error.response && error.response.data instanceof Blob) {
            // Handle JSON error responses sent as Blob
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const errorResponse = JSON.parse(reader.result)
                // setError(errorResponse.message || 'Please check the cart-The cart may be empty')
                setError('Please check the cart-The cart may be empty')
              } catch (e) {
                setError('Please check the cart-The cart may be empty')
              }
            }
            reader.readAsText(error.response.data)
          } else {
            // setError(error.message || 'Failed to download file')
            setError('Please check the cart-The cart may be empty')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
   else if (type === 'quotation') {
    setLoading(true);
    axios.post('summary-quatation', payload, {
        responseType: 'blob',
    })
    .then((response) => {
      console.log(response, "Response from quotation API");
        // First check if this is actually a PDF
        const contentType = response.headers['content-type'];
        
        if (contentType.includes('application/json')) {
            // Handle JSON error response
            return response.data.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || 'Error generating quotation');
                } catch {
                    throw new Error('Invalid response format');
                }
            });
        }

        if (!contentType.includes('application/pdf')) {
            throw new Error('Invalid PDF content type');
        }

        // Extract filename
        let filename = 'quotation_summary.pdf';
        const contentDisposition = response.headers['content-disposition'];
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }

        // Create blob URL
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        setSuccess(`Quotation downloaded successfully!`);
        resetModal();
    })
    .catch((error) => {
        if (error.response && error.response.data instanceof Blob) {
            error.response.data.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    // setError(json.message || 'Failed to generate quotation');
                    setError('Please check the cart-The cart may be empty');
                } catch {
                    setError('Please check the cart-The cart may be empty');
                }
            });
        } else {
            // setError(error.message || 'Failed to download quotation');
            setError('Please check the cart-The cart may be empty');
        }
    })
    .finally(() => {
        setLoading(false);
    });
}
  }

  const resetModal = () => {
    setSelectedCarts([])
    setShippingCharges('')
    setCartDiscount('')
    setCartCurrency('')
    setError(null)
    setSuccess(null)
    setLoading(false)
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

        {cartData?.cart_titles?.length > 0 ? (
          <>
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Available Carts</h5>
                <small className="text-muted">Select one or more carts to process</small>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {cartData.cart_titles.map((cart) => (
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
              </Card.Body>
            </Card>

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
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                    <option value="LKR">LKR</option>
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
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No carts available for this customer.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button variant="outline-danger" className="me-2" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-secondary" onClick={resetModal} disabled={loading}>
            Clear Selection
          </Button>
        </div>
        <div>
          <Button
            variant="success"
            className="me-2"
            onClick={() => handleDownload('pdf')}
            disabled={loading || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading ? (
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
            disabled={loading || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFileWord className="me-1" /> Download Word
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDownload('quotation')}
            disabled={loading || selectedCarts.length === 0 || !cartCurrency}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaFileWord className="me-1" /> Quotation PDF(New)
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CartDetailsModal
