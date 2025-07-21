// Debug utility for authentication issues
export const debugAuthStatus = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  console.group('🔍 Authentication Debug Status');
  
  if (token) {
    
    // Try to decode JWT payload (basic decode, not verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (isExpired) {
        console.error('❌ TOKEN IS EXPIRED! User needs to login again.');
        return { tokenExpired: true };
      }
    } catch (e) {
      console.error('Could not decode token:', e);
    }
  }
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
    } catch (e) {
      console.error('Could not parse user data:', e);
    }
  }
  
  console.groupEnd();
  return { tokenExpired: false };
};

export const checkUserPermissions = () => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return { hasAccess: false, reason: 'No user data found' };
  }
  
  try {
    const user = JSON.parse(userData);
    // Check for both uppercase and lowercase role names
    const hasAdminRole = user.roles?.some(role => 
      role.toUpperCase() === 'ADMIN' || 
      role.toUpperCase() === 'SUPER_ADMIN'
    );
    
    return {
      hasAccess: hasAdminRole,
      reason: hasAdminRole ? 'User has admin access' : `User does not have admin role. Current roles: ${user.roles?.join(', ')}`,
      userRoles: user.roles
    };
  } catch (e) {
    return { hasAccess: false, reason: 'Invalid user data format' };
  }
};

export const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return true;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};
