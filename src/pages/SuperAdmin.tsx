import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Settings, Smartphone, BarChart3, Loader2, LogOut } from 'lucide-react';
import EmpresasTab from '@/components/admin/EmpresasTab';
import PlanosTab from '@/components/admin/PlanosTab';
import { WhatsAppTab } from '@/components/admin/WhatsAppTab';
import UsuariosTab from '@/components/admin/UsuariosTab';
import EvolutionApiConfigTab from '@/components/admin/EvolutionApiConfigTab';
import RelatoriosEstatisticasCard from '@/components/admin/RelatoriosEstatisticasCard';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminLogin } from '@/components/admin/AdminLogin';

import QueueMonitoring from '@/components/admin/QueueMonitoring';
import { N8nIntegrationTab } from '@/components/admin/N8nIntegrationTab';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import PlanosGerenciamento from '@/components/admin/PlanosGerenciamento';
import PermissoesAvancadas from '@/components/admin/PermissoesAvancadas';
import IntegracoesCentralizadas from '@/components/admin/IntegracoesCentralizadas';
import ConfiguracoesAvancadas from '@/components/admin/ConfiguracoesAvancadas';
import ApiKeysConfig from '@/components/admin/ApiKeysConfig';
import { ErrorBoundaryAdmin } from '@/components/admin/ErrorBoundaryAdmin';

export default function SuperAdmin() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    isSuperAdmin,
    loading: roleLoading
  } = useUserRole();
  
  const {
    isAdminAuthenticated,
    adminLogout,
    loading: adminAuthLoading
  } = useAdminAuth();

  // Mostrar loading enquanto verifica permissões
  if (authLoading || roleLoading || adminAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>;
  }

  // Verificar se é super admin após carregamento completo
  if (!user || !isSuperAdmin) {
    return <Navigate to="/painel" replace />;
  }

  // Verificar autenticação admin adicional
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header do Super Admin */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-md">
                <img 
                  src="/lovable-uploads/eddc7fb8-220e-433f-89b2-915fbe2e2daf.png" 
                  alt="Amplie Icon" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img 
                    src="/lovable-uploads/8ed7aa80-8a43-4375-a757-0f7dd486297f.png" 
                    alt="Amplie Chat Logo" 
                    className="h-6 object-contain"
                  />
                  <span className="text-lg font-bold text-primary">Super Admin</span>
                </div>
                <p className="text-sm text-muted-foreground">Gerencie todas as empresas e configurações da plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={adminLogout}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair do Admin
              </Button>
              <div className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ErrorBoundaryAdmin>
          <Tabs defaultValue="analytics" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max grid-cols-6 lg:grid-cols-11 min-w-full lg:min-w-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
              <TabsTrigger value="empresas" className="whitespace-nowrap">Empresas</TabsTrigger>
              <TabsTrigger value="usuarios" className="whitespace-nowrap">Usuários</TabsTrigger>
              <TabsTrigger value="planos" className="whitespace-nowrap">Planos</TabsTrigger>
              <TabsTrigger value="permissoes" className="whitespace-nowrap">Permissões</TabsTrigger>
              <TabsTrigger value="integracoes" className="whitespace-nowrap">Integrações</TabsTrigger>
              <TabsTrigger value="api-keys" className="whitespace-nowrap">API Keys</TabsTrigger>
              <TabsTrigger value="configuracoes" className="whitespace-nowrap">Config</TabsTrigger>
              <TabsTrigger value="whatsapp" className="whitespace-nowrap">WhatsApp</TabsTrigger>
              <TabsTrigger value="evolution-api" className="whitespace-nowrap">Evolution API</TabsTrigger>
              <TabsTrigger value="n8n" className="whitespace-nowrap">n8n</TabsTrigger>
              <TabsTrigger value="filas" className="whitespace-nowrap">Filas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Analytics e Relatórios</CardTitle>
                <CardDescription>
                  Dashboard com métricas avançadas e relatórios personalizáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresas">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Empresas</CardTitle>
                <CardDescription>
                  Gerencie todas as empresas cadastradas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmpresasTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsuariosTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gestão de Planos</CardTitle>
                <CardDescription>
                  Configure planos e permissões da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanosGerenciamento />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissoes">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Permissões Avançadas</CardTitle>
                <CardDescription>
                  Gerencie perfis e permissões granulares do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissoesAvancadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integracoes">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Integrações Centralizadas</CardTitle>
                <CardDescription>
                  Monitore webhooks, APIs e integrações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IntegracoesCentralizadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Gerenciamento de API Keys</CardTitle>
                <CardDescription>
                  Configure e gerencie todas as chaves de API do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeysConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações técnicas e avançadas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfiguracoesAvancadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Conexões WhatsApp</CardTitle>
                <CardDescription>
                  Monitore todas as conexões WhatsApp ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution-api">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Configurações Evolution API</CardTitle>
                <CardDescription>
                  Gerencie as configurações Evolution API de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvolutionApiConfigTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="n8n">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle>Integração n8n</CardTitle>
                <CardDescription>
                  Configure e monitore a integração com n8n para automações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <N8nIntegrationTab />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="filas">
            <QueueMonitoring />
          </TabsContent>
          </Tabs>
        </ErrorBoundaryAdmin>
      </div>
    </div>
  );
}
