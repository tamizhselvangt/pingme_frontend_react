import React from 'react';
import { Box } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
function MediaMessage({ mediaData, mediaType, isYou }) {
  const mediaSrc = `data:${mediaType};base64,${mediaData}`;
  const commonStyles = {
    p: 1,
    borderRadius: 2,
    width: '100%',
    border: '1px solid #e0e0e0',
    padding: 1,
    mt: 1,
  };

  if (mediaType?.startsWith('image/')) {
    return (
      <Box sx={commonStyles}>
        <Box
          component="img"
          src={mediaSrc}
          alt="Image"
          sx={{ width: '100%', borderRadius: 1 }}
        />
      </Box>
    );
  }
  if (mediaType?.startsWith('video/')) {
    return (
      <Box sx={commonStyles}>
        <Box
          component="video"
          src={mediaSrc}
          controls
          sx={{ width: '100%', borderRadius: 1 }}
        />
      </Box>
    );
  }

  if (mediaType?.startsWith('audio')) {
    return (
      <Box sx={{
        ...commonStyles,
          width: '350px',
      }}>
        
 <AudioPlayer
           showSkipControls={false}
           showFilledProgress={false}
           showVolumeControls={false}
           showDownloadProgress={false}
           showJumpControls={false}
           showFilledVolume={false}
           hideVolume={true}
           src={mediaSrc} 
           layout='horizontal'
           style={{
            width: '100%',
            height: '50px',
           }}
           customAdditionalControls={[]}
           customVolumeControls={[]}
        />

      </Box>
      
    );
  }

   

  return 'Media File';
}

export default MediaMessage;
