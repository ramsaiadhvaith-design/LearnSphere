import { authService } from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required.'
    });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Invalid or expired authentication token.'
    });
  }

  // Double-check user still exists and is active
  const user = await userRepository.findById(decoded.id);
  if (!user || user.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: User account is inactive or no longer exists.'
    });
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated: Please log in first.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: '${req.user.role}' role does not have permission to perform this action.`
      });
    }

    next();
  };
}
