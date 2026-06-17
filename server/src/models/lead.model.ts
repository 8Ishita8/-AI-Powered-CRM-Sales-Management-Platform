export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  stage: 'new_lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  conversionScore?: number;
  aiAnalysisSummary?: string;
  assignedTo: string; // User ID
  teamId?: string;
  createdAt: Date;
}

// In-memory mock leads database populated with scoped ownerships
const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Alice Green',
    company: 'Alpha Corp',
    phone: '123-456-7890',
    email: 'alice@alphacorp.com',
    source: 'pricing_page',
    stage: 'new_lead',
    conversionScore: 85,
    assignedTo: '33333333-3333-3333-3333-333333333333', // Assigned to Bob Johnson (Executive on team-alpha)
    teamId: 'team-alpha',
    createdAt: new Date(),
  },
  {
    id: 'lead-2',
    name: 'Charlie Brown',
    company: 'Beta LLC',
    phone: '234-567-8901',
    email: 'charlie@betallc.com',
    source: 'demo_request',
    stage: 'qualified',
    conversionScore: 60,
    assignedTo: '44444444-4444-4444-4444-444444444444', // Assigned to another Exec but on team-alpha
    teamId: 'team-alpha',
    createdAt: new Date(),
  },
  {
    id: 'lead-3',
    name: 'David Smith',
    company: 'Gamma Inc',
    phone: '345-678-9012',
    email: 'david@gammainc.com',
    source: 'cold_outreach',
    stage: 'proposal',
    conversionScore: 40,
    assignedTo: '55555555-5555-5555-5555-555555555555', // Assigned to Exec on team-beta
    teamId: 'team-beta',
    createdAt: new Date(),
  },
];

/**
 * Returns all mock leads
 */
export const getMockLeads = (): Lead[] => {
  return mockLeads;
};

/**
 * Find single mock lead by ID
 */
export const findLeadById = async (id: string): Promise<Lead | null> => {
  const lead = mockLeads.find((l) => l.id === id);
  return lead || null;
};
