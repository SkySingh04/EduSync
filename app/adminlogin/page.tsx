// /pages/admin/index.tsx
"use client";
import React from 'react';
import AuthGuard from '../components/authguard';

import { ROLES } from '../utils/roles';

const AdminPage: React.FC = () => {
  return (
    <AuthGuard requiredRole={ROLES.ADMIN}>
      
        <h1>Admin Dashboard</h1>
        {/* Add your admin-specific content here */}
      
    </AuthGuard>
  );
};

export default AdminPage;
