import api from './axios';

export interface TradingAccount {
  id: string;
  broker: string;
  account_name: string;
  client_id?: string;
  mobile_number?: string;
  status: string;
  last_login?: string;
  created_at: string;
}

export interface TradingAccountCreate {
  broker: string;
  account_name: string;
  client_id?: string;
  api_key?: string;
  api_secret?: string;
  mobile_number?: string;
}

export const getTradingAccounts = async (): Promise<TradingAccount[]> => {
  const response = await api.get('/api/v1/trading-accounts/');
  return response.data;
};

export const createTradingAccount = async (data: TradingAccountCreate): Promise<TradingAccount> => {
  const response = await api.post('/api/v1/trading-accounts/', data);
  return response.data;
};

export const deleteTradingAccount = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/trading-accounts/${id}`);
};
