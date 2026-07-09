import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { TradingAccountsList } from '@/components/TradingAccountsList';
import api from '@/api/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/api/v1/health');
        setHealthStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch health status', error);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        {healthStatus && (
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold mb-2">System Status</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>Backend: <span className="text-green-500">{healthStatus.status}</span></div>
              <div>Database: <span className="text-green-500">{healthStatus.database}</span></div>
              <div>Version: {healthStatus.version}</div>
            </div>
          </div>
        )}
        
        <TradingAccountsList />
      </div>
    </div>
  );
}
