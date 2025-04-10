import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { LuUserRound, LuSmile } from 'react-icons/lu';
import { useChat } from '../context/ChatContext';
const MessageItem = ({ text, time, isSender }) => {
  const { 
    contacts, 
    activeChatId, 
  } = useChat();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isSender ? 'flex-end' : 'flex-start'}
      my={1}
    >
      <Box display="flex" alignItems="center">
        {!isSender && (
          <>
              {/* {activeChatId && (
            // <Avatar 
            //   src={contacts.find(c => c.id === activeChatId)?.avatar} 
            //   alt={contacts.find(c => c.id === activeChatId)?.name}
            //   sx={{ mr: 2 }}
            // />
          )} */}
            <Typography variant="caption" color="gray">
              {time}
            </Typography>
          </>
        )}

        {isSender && (
          <>
            <Typography variant="caption" color="gray" sx={{ mr: 1 }}>
              {time}
            </Typography>
            {/* {activeChatId && (
            <Avatar 
              src={contacts.find(c => c.id === activeChatId)?.avatar} 
              alt={contacts.find(c => c.id === activeChatId)?.name}
              sx={{ mr: 2 }}
            />
          )} */}
          </>
        )}
      </Box>

      <Box display="flex" alignItems="center" mt={0.5}>
        <Typography
          variant="body1"
          sx={{
            maxWidth: '70%',
            textAlign: isSender ? 'right' : 'left',
            color: 'black',
          }}
        >
          {text}
        </Typography>

        {/* Reaction icon */}
        <IconButton size="small" sx={{ ml: 3, color: 'rgba(86, 86, 86, 0.5)' }}>
          <LuSmile size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageItem;
