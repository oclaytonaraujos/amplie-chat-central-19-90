import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Settings, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EvolutionApiConfig {
  id: string;
  empresa_id: string;
  api_key: string;
  server_url: string;
  instance_name: string;
  webhook_url: string | null;
  webhook_events: string[];
  ativo: boolean;
  created_at: string;
  empresas?: {
    nome: string;
    email: string;
  };
}

export default function EvolutionApiConfigTab() {
  const [configs, setConfigs] = useState<EvolutionApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<EvolutionApiConfig | null>(null);
  const [formData, setFormData] = useState({
    empresa_id: '',
    api_key: '',
    server_url: '',
    instance_name: '',
    webhook_url: '',
    webhook_events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('evolution_api_config')
        .select(`
          *,
          empresas (nome, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações Evolution API:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações Evolution API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingConfig) {
        const { error } = await supabase
          .from('evolution_api_config')
          .update(formData)
          .eq('id', editingConfig.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Evolution API atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('evolution_api_config')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Configuração Evolution API criada com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingConfig(null);
      setFormData({
        empresa_id: '',
        api_key: '',
        server_url: '',
        instance_name: '',
        webhook_url: '',
        webhook_events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
      });
      fetchConfigs();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração Evolution API",
        variant: "destructive",
      });
    }
  };

  const toggleConfigStatus = async (config: EvolutionApiConfig) => {
    try {
      const { error } = await supabase
        .from('evolution_api_config')
        .update({ ativo: !config.ativo })
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Configuração ${config.ativo ? 'desativada' : 'ativada'} com sucesso`,
      });

      fetchConfigs();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da configuração",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (config: EvolutionApiConfig) => {
    setEditingConfig(config);
    setFormData({
      empresa_id: config.empresa_id,
      api_key: config.api_key,
      server_url: config.server_url,
      instance_name: config.instance_name,
      webhook_url: config.webhook_url || '',
      webhook_events: config.webhook_events,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (config: EvolutionApiConfig) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

    try {
      const { error } = await supabase
        .from('evolution_api_config')
        .delete()
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configuração Evolution API excluída com sucesso",
      });

      fetchConfigs();
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir configuração Evolution API",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center">Carregando configurações Evolution API...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Configurações Evolution API</h3>
          <p className="text-sm text-gray-600">Gerencie as configurações Evolution API de todas as empresas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingConfig(null);
              setFormData({
                empresa_id: '',
                api_key: '',
                server_url: '',
                instance_name: '',
                webhook_url: '',
                webhook_events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Editar Configuração Evolution API' : 'Nova Configuração Evolution API'}
              </DialogTitle>
              <DialogDescription>
                Configure uma nova instância Evolution API para uma empresa
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="server_url">Server URL</Label>
                <Input
                  id="server_url"
                  value={formData.server_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, server_url: e.target.value }))}
                  placeholder="https://api.evolution-api.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="instance_name">Instance Name</Label>
                <Input
                  id="instance_name"
                  value={formData.instance_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, instance_name: e.target.value }))}
                  placeholder="minha-instancia"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://seu-webhook.com/evolution-api"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingConfig ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {configs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma configuração Evolution API</h3>
            <p className="text-gray-500 mb-4">Crie uma configuração Evolution API para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Instance Name</TableHead>
                <TableHead>Server URL</TableHead>
                <TableHead>Webhook URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{config.empresas?.nome || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{config.empresas?.email || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{config.instance_name}</TableCell>
                  <TableCell>
                    <span className="text-sm text-blue-600">{config.server_url}</span>
                  </TableCell>
                  <TableCell>
                    {config.webhook_url ? (
                      <span className="text-sm text-green-600">Configurado</span>
                    ) : (
                      <span className="text-sm text-gray-400">Não configurado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.ativo ? "default" : "secondary"}>
                      {config.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(config.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(config)}
                        title="Editar configuração"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={config.ativo}
                        onCheckedChange={() => toggleConfigStatus(config)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(config)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir configuração"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}