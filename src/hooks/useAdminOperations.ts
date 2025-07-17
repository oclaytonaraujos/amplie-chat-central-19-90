import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAdminOperations() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const executeOperation = useCallback(async (
    operation: () => Promise<any>,
    options: AdminOperationOptions = {}
  ) => {
    const {
      successMessage = 'Operação realizada com sucesso',
      errorMessage = 'Erro ao executar operação',
      onSuccess,
      onError
    } = options;

    try {
      setLoading(true);
      const result = await operation();

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      onSuccess?.();
      return result;
    } catch (error) {
      console.error('Erro na operação admin:', error);
      
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });

      onError?.(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Operações específicas para empresas
  const createEmpresa = useCallback(async (
    data: any,
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      async () => {
        const { data: result, error } = await supabase.from('empresas').insert(data).select().single();
        if (error) throw error;
        return result;
      },
      {
        successMessage: 'Empresa criada com sucesso',
        ...options
      }
    );
  }, [executeOperation]);

  const updateEmpresa = useCallback(async (
    id: string,
    data: any,
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      async () => {
        const { data: result, error } = await supabase.from('empresas').update(data).eq('id', id).select().single();
        if (error) throw error;
        return result;
      },
      {
        successMessage: 'Empresa atualizada com sucesso',
        ...options
      }
    );
  }, [executeOperation]);

  const deleteEmpresa = useCallback(async (
    id: string,
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      async () => {
        const { error } = await supabase.from('empresas').delete().eq('id', id);
        if (error) throw error;
        return true;
      },
      {
        successMessage: 'Empresa excluída com sucesso',
        ...options
      }
    );
  }, [executeOperation]);

  const fetchEmpresas = useCallback(async (
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      async () => {
        const { data, error } = await supabase
          .from('empresas')
          .select(`*, planos(nome)`)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      },
      {
        errorMessage: 'Erro ao carregar empresas',
        ...options
      }
    );
  }, [executeOperation]);

  const toggleEmpresaStatus = useCallback(async (
    id: string,
    currentStatus: boolean,
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      async () => {
        const { error } = await supabase.from('empresas').update({ ativo: !currentStatus }).eq('id', id);
        if (error) throw error;
        return true;
      },
      {
        successMessage: `Empresa ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`,
        ...options
      }
    );
  }, [executeOperation]);

  const bulkOperation = useCallback(async (
    operations: Array<() => Promise<any>>,
    options: AdminOperationOptions = {}
  ) => {
    return executeOperation(
      () => Promise.all(operations.map(op => op())),
      {
        successMessage: 'Operações em lote realizadas com sucesso',
        ...options
      }
    );
  }, [executeOperation]);

  return {
    loading,
    executeOperation,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    fetchEmpresas,
    toggleEmpresaStatus,
    bulkOperation
  };
}