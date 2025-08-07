import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

function Settings() {
  const [isClearing, setIsClearing] = useState(false)
  const [lastCleared, setLastCleared] = useState(null)

  const handleClearCache = async () => {
    setIsClearing(true)

    try {
      await axios.post('/settings/cache_clear')

      setLastCleared(new Date().toLocaleString())

      Swal.fire({
        icon: 'success',
        title: 'Cache Cleared',
        text: 'The cache was cleared successfully.',
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)

      Swal.fire({
        icon: 'error',
        title: 'Cache Clear Failed',
        text: 'There was an error clearing the cache. Please try again.',
      })
    } finally {
      setIsClearing(false)
    }
  }

  const containerStyle = {
    margin: '0 auto',
    padding: '1.5rem',
  }

  const headerStyle = {
    marginBottom: '2rem',
  }

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0',
  }

  const subtitleStyle = {
    color: '#6b7280',
    margin: '0',
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    marginBottom: '1.5rem',
  }

  const cardHeaderStyle = {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  }

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
  }

  const cardDescriptionStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
    marginBottom: '0',
  }

  const cardContentStyle = {
    padding: '1rem 1.5rem',
  }

  const settingRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  }

  const settingInfoStyle = {
    flex: '1',
  }

  const settingNameStyle = {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '0.25rem',
    margin: '0 0 0.25rem 0',
  }

  const settingDescStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0',
  }

  const lastClearedStyle = {
    display: 'block',
    color: '#059669',
    marginTop: '0.25rem',
  }

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    border: 'none',
    cursor: isClearing ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: isClearing ? '#f3f4f6' : '#dc2626',
    color: isClearing ? '#9ca3af' : 'white',
  }

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: isClearing ? '#f3f4f6' : '#b91c1c',
  }

  const spinnerStyle = {
    width: '1rem',
    height: '1rem',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }

  const placeholderStyle = {
    color: '#9ca3af',
    fontStyle: 'italic',
    margin: '0',
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Settings</h1>
        <p style={subtitleStyle}>Manage application preferences and data.</p>
      </div>

      {/* Cache Management Section */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={cardTitleStyle}>Cache Management</h2>
          <p style={cardDescriptionStyle}>
            Manage application's cached data and temporary files.
          </p>
        </div>

        <div style={cardContentStyle}>
          <div style={settingRowStyle}>
            <div style={settingInfoStyle}>
              <h3 style={settingNameStyle}>Clear Cache</h3>
              <p style={settingDescStyle}>
                Remove all cached data.
                {lastCleared && <span style={lastClearedStyle}>Last cleared: {lastCleared}</span>}
              </p>
            </div>

            <button
              onClick={handleClearCache}
              disabled={isClearing}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (!isClearing) {
                  e.target.style.backgroundColor = '#b91c1c'
                }
              }}
              onMouseLeave={(e) => {
                if (!isClearing) {
                  e.target.style.backgroundColor = '#dc2626'
                }
              }}
            >
              {isClearing ? (
                <>
                  <div style={spinnerStyle}></div>
                  Clearing...
                </>
              ) : (
                'Clear Cache'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for future settings sections */}
      {/* <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={cardTitleStyle}>General Settings</h2>
          <p style={cardDescriptionStyle}>Application preferences and configurations.</p>
        </div>

        <div style={cardContentStyle}>
          <p style={placeholderStyle}>More settings will be available here in future updates.</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={cardTitleStyle}>Privacy & Security</h2>
          <p style={cardDescriptionStyle}>
            Control your privacy settings and security preferences.
          </p>
        </div>

        <div style={cardContentStyle}>
          <p style={placeholderStyle}>Privacy and security options coming soon.</p>
        </div>
      </div> */}
    </div>
  )
}

export default Settings
