import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdminAuthenticated: false,
  adminLogin: async () => ({ success: false }),
  adminLogout: () => {},
  loading: true,
});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe autenticação admin na sessão
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    const adminAuthTime = sessionStorage.getItem('admin_auth_time');
    
    if (adminAuth === 'true' && adminAuthTime) {
      const authTime = parseInt(adminAuthTime);
      const currentTime = Date.now();
      const twoHours = 2 * 60 * 60 * 1000; // 2 horas em millisegundos
      
      // Verificar se a autenticação não expirou (2 horas)
      if (currentTime - authTime < twoHours) {
        setIsAdminAuthenticated(true);
      } else {
        // Limpar autenticação expirada
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_auth_time');
      }
    }
    
    setLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Verificar credenciais específicas do admin
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // Verificar se o usuário é super admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cargo')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.cargo !== 'super_admin') {
        return { success: false, error: 'Acesso negado. Apenas super administradores podem acessar esta área.' };
      }

      // Salvar autenticação admin na sessão
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_auth_time', Date.now().toString());
      setIsAdminAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer login' };
    }
  };

  const adminLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_auth_time');
    setIsAdminAuthenticated(false);
  };

  const value = {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};