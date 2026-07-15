const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ===== USER MODEL =====
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    },
    goal: {
        type: String,
        enum: ['lose_weight', 'gain_muscle', 'maintain', 'flexibility'],
        default: 'maintain'
    },
    membership: {
        type: String,
        enum: ['free', 'premium', 'pro'],
        default: 'free'
    },
    membershipExpiry: {
        type: Date,
        default: null
    },
    streak: {
        type: Number,
        default: 0
    },
    lastWorkout: {
        type: Date,
        default: null
    },
    totalWorkouts: {
        type: Number,
        default: 0
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    achievements: [{
        type: String,
        enum: ['10_workouts', '50_workouts', '100_workouts', '7_day_streak', '30_day_streak', 'first_workout']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// ===== WORKOUT MODEL =====
const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    weight: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    }
});

const WorkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'hiit'],
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    exercises: [ExerciseSchema],
    caloriesBurned: {
        type: Number,
        default: 0
    },
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    notes: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

// ===== MEMBERSHIP MODEL =====
const MembershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['premium', 'pro'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Membership = mongoose.model('Membership', MembershipSchema);

// ===== NUTRITION MODEL =====
const MealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        default: 0
    },
    carbs: {
        type: Number,
        default: 0
    },
    fat: {
        type: Number,
        default: 0
    },
    ingredients: [{
        type: String
    }],
    instructions: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'protein_shake'],
        required: true
    }
});

const NutritionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    meals: [MealSchema],
    totalCalories: {
        type: Number,
        default: 0
    },
    waterIntake: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ''
    }
});

const Nutrition = mongoose.model('Nutrition', NutritionSchema);

// ===== EXERCISE LIBRARY MODEL =====
const ExerciseLibrarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'],
        required: true
    },
    equipment: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    instructions: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    }
});

const ExerciseLibrary = mongoose.model('ExerciseLibrary', ExerciseLibrarySchema);

// ===== CHALLENGE MODEL =====
const ChallengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    goalValue: {
        type: Number,
        required: true
    },
    reward: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        progress: {
            type: Number,
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    active: {
        type: Boolean,
        default: true
    }
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);

// ===== PROGRESS MODEL =====
const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        default: null
    },
    bodyFat: {
        type: Number,
        default: null
    },
    muscleMass: {
        type: Number,
        default: null
    },
    chest: {
        type: Number,
        default: null
    },
    waist: {
        type: Number,
        default: null
    },
    hips: {
        type: Number,
        default: null
    },
    arms: {
        type: Number,
        default: null
    },
    legs: {
        type: Number,
        default: null
    },
    notes: {
        type: String,
        default: ''
    },
    photoBefore: {
        type: String,
        default: ''
    },
    photoAfter: {
        type: String,
        default: ''
    }
});

const Progress = mongoose.model('Progress', ProgressSchema);

// ===== NOTIFICATION MODEL =====
const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['workout_reminder', 'challenge', 'achievement', 'membership', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
    User,
    Workout,
    Membership,
    Nutrition,
    ExerciseLibrary,
    Challenge,
    Progress,
    Notification
};
