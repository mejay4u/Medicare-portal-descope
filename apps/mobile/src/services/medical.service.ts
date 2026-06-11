import { httpClient } from './http';

export interface MedicalHistoryItem {
  id: string;
  category: string;
  type: 'diagnosis' | 'lab' | 'immunization' | 'visit';
  title: string;
  subtitle: string;
  date: string;
  monthLabel: string;
  description: string;
  status?: string;
  showDownload?: boolean;
  notes?: string;
}

class MedicalService {
  async getMedicalHistory(): Promise<MedicalHistoryItem[]> {
    const { data } = await httpClient.get<MedicalHistoryItem[]>('/medicalHistory');
    return data;
  }
}

export const medicalService = new MedicalService();
