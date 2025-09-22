import { useState, useEffect, useCallback } from 'react';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  responded_at?: string;
  notes?: string;
}

export interface LeadStats {
  total: number;
  new_leads: number;
  in_progress: number;
  completed: number;
  closed: number;
  urgent: number;
  today: number;
  this_week: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const useLeads = (filters: LeadFilters = {}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchLeads = useCallback(async (newFilters: LeadFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/leads?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заявок');
      }

      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data.leads);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Ошибка загрузки заявок');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/leads/stats/overview');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки статистики');
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const createLead = async (leadData: Partial<Lead>) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания заявки');
      }

      const data = await response.json();
      
      if (data.success) {
        // Обновляем список заявок
        await fetchLeads();
        await fetchStats();
        return data.data;
      } else {
        throw new Error(data.message || 'Ошибка создания заявки');
      }
    } catch (err) {
      console.error('Error creating lead:', err);
      throw err;
    }
  };

  const updateLead = async (id: number, leadData: Partial<Lead>) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления заявки');
      }

      const data = await response.json();
      
      if (data.success) {
        // Обновляем список заявок
        await fetchLeads();
        await fetchStats();
        return data.data;
      } else {
        throw new Error(data.message || 'Ошибка обновления заявки');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  const deleteLead = async (id: number) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления заявки');
      }

      const data = await response.json();
      
      if (data.success) {
        // Обновляем список заявок
        await fetchLeads();
        await fetchStats();
        return true;
      } else {
        throw new Error(data.message || 'Ошибка удаления заявки');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      throw err;
    }
  };

  const getLead = async (id: number): Promise<Lead | null> => {
    try {
      const response = await fetch(`/api/leads/${id}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заявки');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Ошибка загрузки заявки');
      }
    } catch (err) {
      console.error('Error fetching lead:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [fetchLeads]);

  return {
    leads,
    stats,
    loading,
    error,
    pagination,
    fetchLeads,
    fetchStats,
    createLead,
    updateLead,
    deleteLead,
    getLead,
  };
};
