import { CForm, CFormInput, CListGroup, CListGroupItem } from '@coreui/react'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import './UserAnalytics.css'

const demodats = [
  { id: 1, name: 'Alice Smith' },
  { id: 2, name: 'Bob Johnson' },
  { id: 3, name: 'Clara Garcia' },
  { id: 4, name: 'David Brown' },
  { id: 5, name: 'Emma Lee' },
  { id: 6, name: 'Frank Miller' },
  { id: 7, name: 'Grace Wilsons' },
  { id: 8, name: 'Henry Moore' },
  { id: 9, name: 'Ivy Taylor' },
  { id: 10, name: 'Jack Andersons' },
  { id: 11, name: 'Karen Thomas' },
  { id: 12, name: 'Leo Martinez' },
  { id: 13, name: 'Mia Robinson' },
  { id: 14, name: 'Noah Clark' },
  { id: 15, name: 'Olivia Rodriguez' },
  { id: 16, name: 'Paul Lewis' },
  { id: 17, name: 'Quinn Walker' },
  { id: 18, name: 'Rachel Hall' },
  { id: 19, name: 'Sam Young' },
  { id: 20, name: 'Tina King' },
  { id: 21, name: 'Uma Wright' },
  { id: 22, name: 'Victor Scott' },
  { id: 23, name: 'Wendy Green' },
  { id: 24, name: 'Xander Adams' },
  { id: 25, name: 'Yara Baker' },
  { id: 26, name: 'Zane Carter' },
  { id: 27, name: 'Aiden Hughes' },
  { id: 28, name: 'Bella Foster' },
  { id: 29, name: 'Caleb Simmons' },
  { id: 30, name: 'Diana Evans' },
  { id: 31, name: 'Ethan Foster' },
  { id: 32, name: 'Fiona Green' },
  { id: 33, name: 'George Harris' },
  { id: 34, name: 'Hannah Irving' },
  { id: 35, name: 'Ian Jackson' },
  { id: 36, name: 'Jasmine Lee' },
  { id: 37, name: 'Kevin Turner' },
  { id: 38, name: 'Lily Parker' },
  { id: 39, name: 'Mason Collins' },
  { id: 40, name: 'Nina Stewart' },
  { id: 41, name: 'Owen Murphy' },
  { id: 42, name: 'Piper Hughes' },
  { id: 43, name: 'Quincy Brooks' },
  { id: 44, name: 'Ruby Sanders' },
  { id: 45, name: 'Sebastian Price' },
  { id: 46, name: 'Tara Bell' },
  { id: 47, name: 'Ulysses Ward' },
  { id: 48, name: 'Violet Cox' },
  { id: 49, name: 'Wyatt Diaz' },
  { id: 50, name: 'Zoe Fisher' },
  { id: 51, name: 'Aiden Black' },
  { id: 52, name: 'Alice Brown' },
  { id: 53, name: 'Amelia Clark' },
  { id: 54, name: 'Andrew Cooper' },
  { id: 55, name: 'Angela Davis' },
  { id: 56, name: 'Anthony Evans' },
  { id: 57, name: 'Ariana Flores' },
  { id: 58, name: 'Asher Gray' },
  { id: 59, name: 'Autumn Green' },
  { id: 60, name: 'Aubrey Hall' },
  { id: 61, name: 'Aurora Hill' },
  { id: 62, name: 'Ava Hughes' },
  { id: 63, name: 'Axel Johnson' },
  { id: 64, name: 'Adeline King' },
  { id: 65, name: 'Aaron Lee' },
  { id: 66, name: 'Amara Martin' },
  { id: 67, name: 'Archer Morris' },
  { id: 68, name: 'Alyssa Perry' },
  { id: 69, name: 'Abigail Reed' },
  { id: 70, name: 'Alec Scott' },
]

function CustomerSearch({ setSelectedUserId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [customerData, setCustomerData] = useState(demodats)

  const debounce = (func, delay) => {
    let debounceTimer
    return function (...args) {
      const context = this
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const handleSearch = useCallback(
    debounce((term) => {
      if (term.length > 2) {
        const results = demodats.filter((customer) =>
          customer.name.toLowerCase().includes(term.toLowerCase()),
        )
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    }, 300),
    [],
  )

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  return (
    <div style={{ position: 'relative', width:'50%' }}>
      <CForm>
        <CFormInput
          type="text"
          id="search"
          placeholder="Search any customer...."
          style={{ borderRadius: '20px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CListGroup className="searchResults">
          {searchResults.map((item) => (
            <CListGroupItem key={item.id} onClick={() => setSelectedUserId(item.id)}>
              {item.name}
            </CListGroupItem>
          ))}
        </CListGroup>
      </CForm>
    </div>
  )
}



export default CustomerSearch
