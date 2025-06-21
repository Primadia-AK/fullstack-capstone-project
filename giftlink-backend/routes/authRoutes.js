// Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

// Konfigurasi dotenv
dotenv.config();

// Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Step 2: Endpoint untuk pendaftaran pengguna
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username harus minimal 3 karakter'),
    body('password').isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter'),
  ],
  async (req, res) => {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validasi gagal saat registrasi pengguna');
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const db = await connectToDatabase();
      const userCollection = db.collection('users');

      const existingUser = await userCollection.findOne({ username });
      if (existingUser) {
        logger.info(`Registrasi gagal: Username "${username}" sudah digunakan`);
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const result = await userCollection.insertOne({
        username,
        password: hashedPassword,
      });

   
      const token = jwt.sign(
        { userId: result.insertedId, username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      logger.info(`Pengguna baru terdaftar: ${username}`);
      res.status(201).json({ message: 'Pendaftaran berhasil', token });
    } catch (err) {
      logger.error('Terjadi kesalahan saat registrasi pengguna:', err);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  }
);

module.exports = router;
