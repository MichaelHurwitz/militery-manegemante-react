export interface Mission {
    id: string;
    name: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'High';
    description: string;
  }