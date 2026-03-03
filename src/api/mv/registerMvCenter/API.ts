import { http } from '@/utils/axios'

export const getMonitorApi = (id:string) => {
    return http.get<any>(`/v2/monitor/`+id);
}

export const getComplianceData = (params: { serviceCode: string, startDate: string, endDate: string, filed: string}) => {
    return http.get<any>(`/v2/getComplianceData`,params);
}