import { CForm, CFormInput, CListGroup, CListGroupItem } from '@coreui/react'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './UserAnalytics.css'
import { FaRegWindowClose } from 'react-icons/fa'

function CustomerSearch({ setSelectedUser }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

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
          await axios
            .get(`searchCustomers/${term}`)
            .then((response) => {
              setSearchResults(response.data)
            })
            .catch((error) => {
              console.error(error)
            })
        } catch (error) {
          console.error(error)
        }
      } else {
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
    <div style={{ position: 'relative', width: '50%' }}>
      <CForm>
        <div className="search-container">
          <CFormInput
            type="text"
            id="search"
            placeholder="Search any customer...."
            style={{ borderRadius: '20px', paddingRight: '35px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaRegWindowClose id="clearIcon" onClick={() => setSearchTerm('')} />
        </div>
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
