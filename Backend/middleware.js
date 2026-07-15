const jwt = require('jsonwebtoken');
const { User } = require('./models');

// ===== AUTH MIDDLEWARE =====
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== ADMIN MIDDLEWARE =====
const admin = async (req, res, next) => {
    try {
        // Check if user is admin (you can add an isAdmin field to User model)
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== RATE LIMITING MIDDLEWARE =====
const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!requests.has(ip)) {
            requests.set(ip, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        const data = requests.get(ip);
        
        if (now > data.resetTime) {
            data.count = 1;
            data.resetTime = now + windowMs;
            return next();
        }
        
        data.count++;
        
        if (data.count > max) {
            return res.status(429).json({ 
                error: 'Too many requests. Please try again later.' 
            });
        }
        
        next();
    };
};

// ===== VALIDATION MIDDLEWARE =====
const validate = (validations) => {
    return async (req, res, next) => {
        const { validationResult } = require('express-validator');
        
        await Promise.all(validations.map(validation => validation.run(req)));
        
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        
        res.status(400).json({ 
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    };
};

// ===== CORS MIDDLEWARE =====
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

// ===== LOGGING MIDDLEWARE =====
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};

// ===== ERROR HANDLING MIDDLEWARE =====
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    
    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// ===== NOT FOUND MIDDLEWARE =====
const notFound = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

// ===== AUTH VALIDATION RULES =====
const { body } = require('express-validator');

const authValidation = {
    register: [
        body('name').notEmpty().trim().escape().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    login: [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ]
};

// ===== WORKOUT VALIDATION RULES =====
const workoutValidation = {
    create: [
        body('name').notEmpty().trim().escape().withMessage('Workout name is required'),
        body('type').isIn(['strength', 'cardio', 'flexibility', 'hiit']).withMessage('Invalid workout type'),
        body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
        body('exercises').optional().isArray().withMessage('Exercises must be an array'),
        body('intensity').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid intensity')
    ],
    complete: [
        body('caloriesBurned').optional().isInt({ min: 0 }).withMessage('Calories must be a positive number')
    ]
};

// ===== USER VALIDATION RULES =====
const userValidation = {
    update: [
        body('name').optional().trim().escape(),
        body('age').optional().isInt({ min: 10, max: 120 }).withMessage('Age must be between 10 and 120'),
        body('weight').optional().isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
        body('height').optional().isFloat({ min: 100, max: 300 }).withMessage('Height must be between 100 and 300 cm'),
        body('goal').optional().isIn(['lose_weight', 'gain_muscle', 'maintain', 'flexibility'])
    ]
};

module.exports = {
    auth,
    admin,
    rateLimiter,
    validate,
    corsOptions,
    logger,
    errorHandler,
    notFound,
    authValidation,
    workoutValidation,
    userValidation
};
