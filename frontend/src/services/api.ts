import axios from 'axios';
import { CaseScrutinyResult } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  uploadCasePDF: async (file: File): Promise<CaseScrutinyResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/cases/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCaseScrutiny: async (caseId: string): Promise<CaseScrutinyResult> => {
    const response = await axios.get(`${API_BASE_URL}/cases/${caseId}`);
    return response.data;
  },
};
