import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'learnsphere_jwt_super_secure_academic_dev_secret_2026_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authService = {
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  async registerStudent({ name, email, password }) {
    if (!name || !email || !password) {
      throw { status: 400, message: 'Name, email, and password are required.' };
    }

    if (password.length < 6) {
      throw { status: 400, message: 'Password must be at least 6 characters long.' };
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists.' };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // CRITICAL SECURITY RULE: Public registration creates Student accounts only.
    const user = await userRepository.create({
      name: name.trim(),
      email: email.trim(),
      password_hash,
      role: 'student',
      status: 'active'
    });

    const token = this.generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw { status: 400, message: 'Email and password are required.' };
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid email or password credentials.' };
    }

    if (user.status !== 'active') {
      throw { status: 403, message: 'Your account has been deactivated. Please contact an administrator.' };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password credentials.' };
    }

    const { password_hash, ...safeUser } = user;
    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  },

  async createPrivilegedUser({ name, email, password, role }) {
    if (!name || !email || !password || !role) {
      throw { status: 400, message: 'All fields (name, email, password, role) are required.' };
    }

    if (!['faculty', 'admin', 'student'].includes(role)) {
      throw { status: 400, message: 'Invalid role specified.' };
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists.' };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      name: name.trim(),
      email: email.trim(),
      password_hash,
      role,
      status: 'active'
    });

    return user;
  }
};
