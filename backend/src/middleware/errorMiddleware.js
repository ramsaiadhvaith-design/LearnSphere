import multer from 'multer';

export function errorHandler(err, req, res, next) {
  // Multer-specific error handling
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File upload exceeds maximum allowed size of 25MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Known application errors
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'An error occurred.'
    });
  }

  // Unhandled internal server errors
  console.error('[LearnSphere Server Error]:', err);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error. Please try again later.'
  });
}
