import { useState, useRef, useEffect } from 'react';
import { 
  Box,
  IconButton,
  LinearProgress,
  Typography
} from '@mui/material';
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineFilePresent } from "react-icons/md";
import { PiWaveformBold } from "react-icons/pi";
// Custom hook for audio recording
const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [visualizerData, setVisualizerData] = useState([]);
  const [recordedFile, setRecordedFile] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordedFile(new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' }));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = [];

      // Set up audio visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        setVisualizerData([...dataArray]);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioURL('');
    setRecordedFile(null);
    setVisualizerData([]);
  };

  return {
    isRecording,
    audioURL,
    visualizerData,
    recordedFile,
    startRecording,
    stopRecording,
    deleteRecording
  };
};

// File size formatter
const getFileSize = (file) => {
  if (!file) return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (file.size === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)));
  return Math.round(file.size / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// AudioRecorder Component
const AudioRecorder = ({ onRecordingComplete, currentlyUploading = false, uploadProgress = 0 }) => {
  const {
    isRecording,
    audioURL,
    visualizerData,
    recordedFile,
    startRecording,
    stopRecording,
    deleteRecording
  } = useAudioRecorder();

  // Handle the recording toggle
  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Effect to notify parent of recording completion
  useEffect(() => {
    if (recordedFile && onRecordingComplete) {
      onRecordingComplete(recordedFile);
    }
  }, [recordedFile, onRecordingComplete]);

  return (
    <>
      {/* Recording button */}
      <IconButton 
        onClick={handleRecordingToggle} 
        sx={{ 
          color: isRecording ? 'error.main' : 'rgba(68, 68, 68, 0.75)',
          animation: isRecording ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 }
          }
        }}
      >
         <PiWaveformBold />
      </IconButton>

      {/* Visualizer when recording */}
      {isRecording && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '60px',
            left: '10px',
            display: 'flex',
            alignItems: 'flex-end',
            height: '50px',
            backgroundColor: 'rgba(157, 151, 199, 0.9)',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 10
          }}
        >
          {visualizerData.slice(0, 50).map((value, index) => (
            <Box
              key={index}
              sx={{
                width: '3px',
                backgroundColor: '#ffffff',
                height: `${value / 2}px`,
                marginRight: '1px',
                borderRadius: '1px'
              }}
            />
          ))}
          <Typography sx={{ color: 'white', ml: 1 }}>Recording...</Typography>
        </Box>
      )}

      {/* Recorded file preview */}
      {recordedFile && !isRecording && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '60px',
            left: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              fontSize: '28px',
              backgroundColor: '#9D97C7',
              color: 'white',
              pt: 1,
              pb: 0,
              pl: 1,
              pr: 1,
              borderRadius: '8px',
            }}
          >
            <MdOutlineFilePresent />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              backgroundColor: '#9D97C7',
              borderRadius: '5px',
              padding: '8px',
              maxWidth: '300px',
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: '0.8rem',
                textOverflow: 'ellipsis',
                fontFamily: 'GeneralSans-SemiBold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              recorded_audio.wav
            </Typography>

            {currentlyUploading ? (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  mt: 1,
                  height: '10px',
                  width: '100%',
                  borderRadius: '30px',
                  backgroundColor: '#b6b6b6',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#5A65CA',
                    borderRadius: '30px',
                  },
                }}
              />
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: 'white',
                    mt: 1,
                    textAlign: 'start',
                  }}
                >
                  File Size: {getFileSize(recordedFile)}
                </Typography>
                <audio src={audioURL} controls style={{ marginTop: '8px', width: '100%', height: '30px' }} />
              </>
            )}
          </Box>

          <IconButton onClick={deleteRecording}>
            <Box component={IoCloseCircleOutline} sx={{ color: '#E66104', fontSize: '1.8rem' }} />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default AudioRecorder;
