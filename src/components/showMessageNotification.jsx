// showMessageNotification.js
import React from 'react';
import { enqueueSnackbar, closeSnackbar } from 'notistack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export function showMessageNotification(user) {
  enqueueSnackbar('', {
    content: (key) => (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          maxWidth: 300,
        }}
      >
        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          sx={{ width: 40, height: 40, marginRight: '12px' }}
        />
        <div style={{ flex: 1 }}>
          <Typography variant="body1" style={{ fontWeight: 500 }}>
            You have a new message
          </Typography>
          <Typography variant="body2" color="textSecondary">
            from {user.name}
          </Typography>
        </div>
        <button
          onClick={() => closeSnackbar(key)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginLeft: '8px',
            color: '#888',
          }}
        >
          ×
        </button>
      </div>
    ),
  });
}
