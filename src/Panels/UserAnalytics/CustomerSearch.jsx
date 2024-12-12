import { CForm, CFormInput, CListGroup, CListGroupItem, CSpinner } from '@coreui/react'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './UserAnalytics.css'
import '../PushNotifications/PushNotifications.css';
import { FaRegWindowClose } from 'react-icons/fa'

function CustomerSearch({ setSelectedUser, setIsLoading , handleClearUserSuccess}) {
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
    <div>
      <CForm>
        <div  style={{  }}>
          <div className='search-container'>
          <CFormInput
            type="text"
            id="search"
            placeholder="Search customer...."
            style={{ }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {!searchingCustomers && <FaRegWindowClose id="clearIcon" onClick={() => {
            setSearchTerm('')
            handleClearUserSuccess();
            }} />}
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
         

        </div>
        {/* position: absolute;
    right: 12px;
    top: 40%;
    transform: translateY(-50%); */}
    {
      searchResults.length !== 0 ? (
          <CListGroup  style={{width:"20%"}} className="searchResults">
        {searchResults.map((item) => (
          <CListGroupItem
            key={item.id}
            // style={{width:"30%"}}
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
        
      ): null 
    }
      
      </CForm>
    </div>
  )
}

export default CustomerSearch
