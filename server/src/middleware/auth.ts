import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { findUserById } from '../data/users';
import { User, UserRole, Context } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'tms-super-secret-key-2024';

export const generateToken = (user: User): string => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string): { userId: string; role: UserRole } | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole };
    } catch {
        return null;
    }
};

export const getUser = async (req: Request): Promise<Context['user']> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return null;
    }

    const user = findUserById(decoded.userId);

    if (!user) {
        return null;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const isAdmin = (user: Context['user']): boolean => {
    return user?.role === UserRole.ADMIN;
};

export const isAuthenticated = (user: Context['user']): boolean => {
    return user !== null;
};

export class AuthenticationError extends Error {
    constructor(message: string = 'Not authenticated') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends Error {
    constructor(message: string = 'Not authorized') {
        super(message);
        this.name = 'AuthorizationError';
    }
}
