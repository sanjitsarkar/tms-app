import bcrypt from 'bcryptjs';
import { User, UserRole } from '../types';

// Demo users with hashed passwords
const users: User[] = [
    {
        id: '1',
        email: 'admin@tms.com',
        password: '', // Will be set on init
        name: 'John Admin',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        email: 'employee@tms.com',
        password: '', // Will be set on init
        name: 'Jane Employee',
        role: UserRole.EMPLOYEE,
        createdAt: new Date().toISOString()
    }
];

// Initialize passwords synchronously for demo
const adminHash = bcrypt.hashSync('admin123', 10);
const employeeHash = bcrypt.hashSync('employee123', 10);
users[0].password = adminHash;
users[1].password = employeeHash;

export const findUserByEmail = (email: string): User | undefined =>
    users.find(u => u.email.toLowerCase() === email.toLowerCase());

export const findUserById = (id: string): User | undefined =>
    users.find(u => u.id === id);

export const validatePassword = async (password: string, hash: string): Promise<boolean> =>
    bcrypt.compare(password, hash);

export default users;
