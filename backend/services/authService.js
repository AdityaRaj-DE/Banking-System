import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import customerRepository from '../repositories/customerRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

class AuthService {
  async register(customerData) {
    const { email, password } = customerData;
    const existingUser = await customerRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await customerRepository.create({
      ...customerData,
      password: hashedPassword
    });

    return { id: userId, email };
  }

  async login(email, password) {
    const user = await customerRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ id: user.customer_id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    return {
      token,
      user: {
        id: user.customer_id,
        name: user.name,
        email: user.email
      }
    };
  }

  async getMe(userId) {
    const user = await customerRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }
}

export default new AuthService();
