import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import { UserModel } from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Set token from cookie
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        req.user = await UserModel.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorResponse('User not found', 401));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};