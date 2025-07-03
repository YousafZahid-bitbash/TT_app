import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      const accessToken = localStorage.getItem('tiktok_access_token');
      const tokenData = localStorage.getItem('tiktok_token_data');
      const shopInfo = localStorage.getItem('tiktok_shop_info');

      if (accessToken && tokenData && shopInfo) {
        try {
          const parsedTokenData = JSON.parse(tokenData);
          const parsedShopInfo = JSON.parse(shopInfo);
          
          setUser({
            accessToken,
            ...parsedTokenData,
            ...parsedShopInfo
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (tokenData) => {
    localStorage.setItem('tiktok_access_token', tokenData.access_token);
    localStorage.setItem('tiktok_refresh_token', tokenData.refresh_token);
    localStorage.setItem('tiktok_token_data', JSON.stringify(tokenData));
    localStorage.setItem('tiktok_shop_info', JSON.stringify({
      shop_id: tokenData.shop_id,
      shop_name: tokenData.shop_name,
      seller_name: tokenData.seller_name
    }));

    setUser({
      accessToken: tokenData.access_token,
      ...tokenData
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('tiktok_access_token');
    localStorage.removeItem('tiktok_refresh_token');
    localStorage.removeItem('tiktok_token_data');
    localStorage.removeItem('tiktok_shop_info');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const getAccessToken = () => {
    return localStorage.getItem('tiktok_access_token');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 