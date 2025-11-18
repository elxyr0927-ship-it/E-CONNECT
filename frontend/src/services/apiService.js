import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
});

const mockUser = {
  name: 'Juan Dela Cruz',
  points: 3250,
  completedPickups: 14,
  scheduledPickups: 3,
  weeklyPoints: 120,
  membership: 'Eco Citizen Pro',
  district: 'Barangay Bantayan',
};

const mockActivities = [
  { id: 1, title: 'Plastic recycling pickup', date: 'Nov 18, 2025', points: 50, icon: '♻️', location: 'Barangay 3' },
  { id: 2, title: 'Paper recycling pickup', date: 'Nov 17, 2025', points: 30, icon: '📄', location: 'Barangay Bantayan' },
  { id: 3, title: 'Glass recycling pickup', date: 'Nov 15, 2025', points: 40, icon: '🍶', location: 'Barangay Daro' },
];

const mockHistory = { activities: mockActivities };

const useMock = () => !import.meta.env.VITE_API_BASE_URL;

export const getUserData = async (userId) => {
  if (useMock()) return mockUser;
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const getPickupHistory = async (userId) => {
  if (useMock()) return mockHistory;
  const { data } = await api.get(`/users/${userId}/history`);
  return data;
};

export const updateUserPoints = async (userId, delta) => {
  if (useMock()) {
    return { ...mockUser, points: mockUser.points + delta };
  }
  const { data } = await api.post(`/users/${userId}/points`, { delta });
  return data;
};

export const redeemReward = async (userId, rewardId) => {
  if (useMock()) {
    return { success: true };
  }
  const { data } = await api.post(`/users/${userId}/redeem`, { rewardId });
  return data;
};
