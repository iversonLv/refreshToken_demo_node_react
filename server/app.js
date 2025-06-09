import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

// JWT 1
var SECRITE = '123';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

/***
 * @description Generates a JWT token.
 * 
 * @param {string} data - The payload data to be encrypted.
 * @param {string} secret - The secret key used for signing the token.
 * @param {string|number} expiresIn - Token expiration time (e.g., '1h', 3600).
 * @returns {string} The generated JWT token as a string.
 * @example
 * ```js
 * const accessToken = generateToken('xxx', SECRITE, '3000');
 * ```
 */
const generateToken = (data, secrite, expiresIn) => {
  return jwt.sign({
    data
  }, secrite, { expiresIn });
}

/**
 * Middleware to verify JWT token from the request headers.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization.split(' ')[ 1 ];
  jwt.verify(accessToken, SECRITE, (error, data) => {
    if (error) {
      return res.status(401).json({
        code: 401, message: 'Unauthorized access, please login first',
      });
    }
    next()
  })
};

// endpoints
app.post('/auth/login', (req, res) => {

  const accessToken = generateToken('foo', SECRITE, '3000');
  const refreshToken = generateToken('bar', SECRITE, '5000');

  res.status(200).json({
    accessToken,
    refreshToken,
    message: 'Login success',
  });
});

app.post('/auth/refreshToken', (req, res) => {
  const refreshToken = req.headers.authorization.split(' ')[ 1 ]
  // check if refreshToken is provided
  jwt.verify(refreshToken, SECRITE, (error, data) => {
    if (error) {
      return res.status(401).json({
        code: 401, message: 'Unauthorized access, please login first refreshToken',
      });
    }

    // ok
    const accessToken = generateToken('foo', SECRITE, '3000');
    return res.status(200).json({
      accessToken
    })
  })
});

// Protected route
app.get('/users', authMiddleware, (req, res) => {
  res.status(200).json({
    users: [
      { id: 1, name: 'User One' },
      { id: 2, name: 'User Two' },
    ],
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});