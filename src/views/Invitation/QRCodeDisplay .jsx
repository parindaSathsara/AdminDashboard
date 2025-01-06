import React from 'react';
import { CImage, CButton, CSpinner } from '@coreui/react';

const QRCodeDisplay = ({
  title = "QR Code",
  qrCodeUrl,
  onDownload,
  isDownloading = false,
  showDownloadButton = true,
  className = ""
}) => {
  if (!qrCodeUrl) return null;

  return (
    <div className={`text-center ${className}`}>
      <h5 className="mb-3">{title}</h5>
      <>
        <CImage
          src={qrCodeUrl}
          alt="QR Code"
          className="mw-100 h-auto mb-3"
        />
        {showDownloadButton && (
          <div>
            <CButton
              color="primary"
              onClick={onDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Converting...
                </>
              ) : (
                'Download QR Code (PNG)'
              )}
            </CButton>
          </div>
        )}
        <p className="text-muted small mt-2">Scan to view details</p>
      </>
    </div>
  );
};

export default QRCodeDisplay;
