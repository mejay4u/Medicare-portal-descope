import {
  setBaseUrl,
  getProviders,
  getClaims,
  getNotifications,
  markNotificationRead,
} from '../services/dashboardService';

setBaseUrl('http://localhost:3001');

const PROVIDERS = [
  {
    id: 'p1', name: 'Dr. Ada Lovelace', specialty: 'Cardiology',
    category: 'Cardiologist', rating: 4.8, distance: 1.2, photo: '',
    inNetwork: true, address: '100 Test St', coordinate: { latitude: 39.95, longitude: -75.16 },
  },
];

const CLAIMS = [
  {
    id: 'c1', provider: 'Penn Medicine', type: 'Medical', date: '2025-01-15',
    status: 'Processed', memberResponsibility: 25, totalBilled: 200,
    planDiscount: 100, insurancePaid: 75, serviceDate: '2025-01-10',
    category: 'Office Visit', doctor: 'Dr. Smith', doctorNpi: '1234567890',
    address: '3400 Spruce St', diagnoses: [], services: [], journey: [],
  },
];

function mockFetch(data: unknown, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
  }) as jest.Mock;
}

afterEach(() => jest.restoreAllMocks());

describe('getProviders', () => {
  it('returns validated providers array', async () => {
    mockFetch(PROVIDERS);
    const result = await getProviders();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. Ada Lovelace');
    expect(result[0].inNetwork).toBe(true);
  });

  it('appends category query param', async () => {
    mockFetch(PROVIDERS);
    await getProviders({ category: 'Cardiologist' });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('category=Cardiologist');
  });

  it('does not append category param when value is All', async () => {
    mockFetch(PROVIDERS);
    await getProviders({ category: 'All' });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).not.toContain('category=');
  });

  it('appends maxDistance param', async () => {
    mockFetch(PROVIDERS);
    await getProviders({ maxDistance: 10 });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('maxDistance=10');
  });

  it('appends name param', async () => {
    mockFetch(PROVIDERS);
    await getProviders({ name: 'ada' });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('name=ada');
  });

  it('throws on server error', async () => {
    mockFetch({}, false);
    await expect(getProviders()).rejects.toThrow('Server error 500');
  });

  it('throws when Zod validation fails', async () => {
    mockFetch([{ id: 'bad', missingRequiredFields: true }]);
    await expect(getProviders()).rejects.toThrow();
  });
});

describe('getClaims', () => {
  it('returns validated claims array', async () => {
    mockFetch(CLAIMS);
    const result = await getClaims();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c1');
    expect(result[0].memberResponsibility).toBe(25);
  });

  it('throws on server error', async () => {
    mockFetch({}, false);
    await expect(getClaims()).rejects.toThrow('Server error 500');
  });
});

describe('getNotifications', () => {
  it('returns validated notifications', async () => {
    mockFetch([
      { id: 'n1', type: 'wellness', title: 'Stay active', body: 'Walk', timestamp: new Date().toISOString(), read: false },
    ]);
    const result = await getNotifications();
    expect(result[0].id).toBe('n1');
    expect(result[0].read).toBe(false);
  });

  it('rejects unknown notification types via Zod', async () => {
    mockFetch([{ id: 'x', type: 'unknown_type', title: 'X', body: 'X', timestamp: new Date().toISOString(), read: false }]);
    await expect(getNotifications()).rejects.toThrow();
  });
});

describe('markNotificationRead', () => {
  it('PATCHes the correct URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({ id: 'n1', read: true }),
    }) as jest.Mock;

    const result = await markNotificationRead('n1');
    expect(result).toEqual({ id: 'n1', read: true });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/notifications/n1/read');
    expect((init as RequestInit).method).toBe('PATCH');
  });
});
