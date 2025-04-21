import React, { useState } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function MediaMessage({ mediaUrl, mediaType, isYou }) {
  const [open, setOpen] = useState(false);

  const commonStyles = {
    p: 1,
    borderRadius: 2,
    width: '100%',
    border: '1px solid #e0e0e0',
    padding: 1,
    mt: 1,
  };

  const previewStyles = {
    width: '250px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    bgcolor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
  };

  if (mediaType?.startsWith('image/')) {
    return (
      <Box sx={commonStyles}>
        <Box
          component="img"
          src={mediaUrl}
          alt="Image"
          sx={previewStyles}
          onClick={() => setOpen(true)}
        />
        {open && (
          <Box sx={overlayStyles}>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={mediaUrl}
              alt="Full Image"
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 2,
                boxShadow: 5,
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  if (mediaType?.startsWith('video/')) {
    return (
      <Box sx={commonStyles}>
        <Box
          component="video"
          src={mediaUrl}
          sx={previewStyles}
          onClick={() => setOpen(true)}
          muted
        />
        {open && (
          <Box sx={overlayStyles}>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="video"
              src={mediaUrl}
              controls
              autoPlay
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 2,
                boxShadow: 5,
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  if (mediaType?.startsWith('audio')) {
    return (
      <Box sx={{ ...commonStyles, width: '350px' }}>
        <AudioPlayer
          showSkipControls={false}
          showFilledProgress={false}
          showVolumeControls={false}
          showDownloadProgress={false}
          showJumpControls={false}
          showFilledVolume={false}
          hideVolume={true}
          src={mediaUrl}
          layout='horizontal'
          style={{ width: '100%', height: '50px' }}
          customAdditionalControls={[]}
          customVolumeControls={[]}
        />
      </Box>
    );
  }

  if (mediaType?.startsWith( 'application/pdf')) {
    return (
      <Box sx={commonStyles}>
        <Button 
          variant="outlined" 
          onClick={() => window.open(mediaUrl, '_blank')}
        >
          📄 Open PDF
        </Button>
      </Box>
    );
  }
  
  if (mediaType?.startsWith('application/msword')|| 
      mediaType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      <Box sx={commonStyles}>
        <Button 
          variant="outlined" 
          component="a"
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          📝 Download DOC
        </Button>
      </Box>
    );
  }
  
  // If it's not a known type, fallback:
  return (
    <Box sx={commonStyles}>
      <Typography variant="body2">
        📎 <a href={mediaUrl} download>Download File</a>
      </Typography>
    </Box>
  );
  

  return 'Unsupported Media Type';
}

export default MediaMessage;
