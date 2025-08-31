import { RequestHandler } from 'express';

export interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'QA' | 'Business' | 'User';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  phoneNumber?: string;
  department?: string;
  lineManager?: string;
  profilePicture?: string;
}

let uid = 10;
const users: UserRow[] = [
  { id: '1', firstName: 'System', lastName: 'Administrator', email: 'admin@safaricom.co.ke', role: 'Admin', status: 'Active', lastLogin: new Date().toISOString(), phoneNumber: '+254700000001', department: 'IT', lineManager: 'CTO', profilePicture: '/placeholder.svg' },
  { id: '2', firstName: 'Biz', lastName: 'User', email: 'business@safaricom.co.ke', role: 'Business', status: 'Active', lastLogin: new Date().toISOString(), phoneNumber: '+254700000002', department: 'Sales', lineManager: 'Sales Lead', profilePicture: '/placeholder.svg' },
  { id: '3', firstName: 'Regular', lastName: 'User', email: 'user@safaricom.co.ke', role: 'User', status: 'Inactive', lastLogin: new Date().toISOString(), phoneNumber: '+254700000003', department: 'Support', lineManager: 'Support Manager', profilePicture: '/placeholder.svg' },
];

export const listUsers: RequestHandler = (_req, res) => {
  res.json({ items: users });
};

export const createUser: RequestHandler = (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber, department, lineManager, profilePicture } = req.body || {};
  if (!firstName || !lastName || !email || !password || !role || !phoneNumber || !department || !lineManager) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const user: UserRow = {
    id: String(++uid),
    firstName,
    lastName,
    email,
    role,
    status: 'Active',
    lastLogin: new Date().toISOString(),
    phoneNumber,
    department,
    lineManager,
    profilePicture,
  };
  users.unshift(user);
  res.status(201).json(user);
};

export const getUser: RequestHandler = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
};

export const updateUser: RequestHandler = (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const patch = req.body || {};
  users[idx] = { ...users[idx], ...patch };
  res.json(users[idx]);
};

export const deleteUser: RequestHandler = (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  res.json({ ok: true });
};

export const changePassword: RequestHandler = (req, res) => {
  const { userId, currentPassword, newPassword, confirmPassword } = req.body || {};
  if (!userId || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  // Mock success (no real password storage in this demo)
  return res.json({ ok: true, message: 'Password updated successfully' });
};
