import { IconButton, Box, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { MdOutlineAddReaction } from "react-icons/md";

const emojis = ['😂', '❤️', '👍', '🔥', '😢', '😮'];

  export default function EmojiPickerButton({ onSelect }) {
  const [show, setShow] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const pickerRef = useRef(null);
  
  // Handle click outside to close the picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    
    // Add event listener when the picker is shown
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  return (
    <Box position="relative" ref={pickerRef}>
      <IconButton 
        sx={{ 
          p: 0.5, 
          color: 'rgba(86, 86, 86, 0.6)', 
          '&:hover': {
            color: 'rgba(86, 86, 86, 0.9)',
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          },
          transition: 'all 0.2s ease-in-out'
        }} 
        onClick={() => setShow((prev) => !prev)}
      >
        {selectedEmoji ? 
             <Box sx={{ fontSize: '1.2rem', color: 'rgb(86, 86, 86)'  }}>{selectedEmoji}</Box>
         : <MdOutlineAddReaction size={15} />}
      </IconButton>
      
      {/* Speech bubble container */}
      <Box
        sx={{
          position: 'absolute',
          bottom: show ? '40px' : '30px',
          left: '-10px',
          zIndex: 10,
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transformOrigin: 'bottom left',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: show ? 'auto' : 'none',
        }}
      >
        {/* Bubble content */}
        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '18px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            p: '4px 8px',
            display: 'flex',
            gap: 0.5,
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '14px',
              width: '20px',
              height: '10px',
              backgroundColor: 'white',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-11px',
              left: '13px',
              width: '22px',
              height: '11px',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backgroundColor: 'transparent',
              borderLeft: '1px solid #ddd',
              borderRight: '1px solid #ddd',
              zIndex: -1,
            }
          }}
        >
          {emojis.map((emoji) => (
            <IconButton
              key={emoji}
              sx={{
                p: 0.5,
                fontSize: '1.2rem',
                color: 'rgba(0, 0, 0, 0.9)',
                '&:hover': {
                  transform: 'scale(1.2)',
                 backgroundColor: 'transparent',
                },
                transition: 'transform 0.15s ease-in-out'
              }}
              onClick={() => {
                onSelect(emoji);
                setSelectedEmoji(emoji);
                setShow(false);
              }}
            >
              {emoji}
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
