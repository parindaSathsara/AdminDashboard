import { CForm, CFormInput, CListGroup, CListGroupItem, CSpinner } from '@coreui/react'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './UserAnalytics.css'
import { FaRegWindowClose } from 'react-icons/fa'

function CustomerSearch({ setSelectedUser, setIsLoading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);

  const debounce = (func, delay) => {
    let debounceTimer
    return function (...args) {
      const context = this
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (term.length > 2) {
        try {
          setSearchingCustomers(true);
          await axios
            .get(`searchCustomers/${term}`)
            .then((response) => {
              setSearchResults(response.data)
              setSearchingCustomers(false);
            })
            .catch((error) => {
              console.error(error)
            })
        } catch (error) {
          console.error(error)
        }
      } else {
        setSearchingCustomers(false);
        setSearchResults([])
      }
    }, 1000),
    [],
  )

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  //handle the customer selection
  const handleCustomerSelection = (user) => {
    setSelectedUser(user)
    setSearchResults([])
  }

  return (
    <div className='search-container'>
      <CForm>
        <div style={{ position: 'relative' }}>
          <CFormInput
            type="text"
            id="search"
            placeholder="Search any customer...."
            style={{ borderRadius: '20px', paddingRight: '35px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {!searchingCustomers && <FaRegWindowClose id="clearIcon" onClick={() => setSearchTerm('')} />}
          {searchingCustomers && (
            <CSpinner
            style={{
              position:'absolute',
              right:"12px",
              bottom:"10px",
              width:'0.8em',
              height:'0.8em'
            }}
            />
          )}

        </div>
        {/* position: absolute;
    right: 12px;
    top: 40%;
    transform: translateY(-50%); */}
        <CListGroup className="searchResults">
          {searchResults.map((item) => (
            <CListGroupItem
              key={item.id}
              onClick={() => handleCustomerSelection(item)}
              onMouseOver={(e) => {
                e.currentTarget.style.cursor = 'pointer'
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = ''
              }}
            >
              {item.customer_fname}
            </CListGroupItem>
          ))}
        </CListGroup>
      </CForm>
    </div>
  )
}

export default CustomerSearch
