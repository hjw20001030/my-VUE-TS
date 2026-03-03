import { http } from '@/utils/axios'

export const getDetailApi = (id:string) => {
    return http.get<any>(`/v2/detail/${id}`);
}

interface GetReviewParams {
  start: string | Date,
  duration:number
}
export const getReviewApi = (id:string,params:GetReviewParams) => {
    return http.get<any>(`/v2/review/${id}`, params);
}

export const getAlarmDataApi = (id:string,params:GetReviewParams) => {
  return http.get<any>(`/v2/simple/${id}`, params);
}

export const getComplianceApi = (id:string,params:GetReviewParams) => {
  return http.get<any>(`/v2/compliance/${id}`, params);
}

export const getTrendDataApi = (id:string,params:GetReviewParams) => {
  return http.get<any>(`/v2/wave/${id}`, params);
}
export const getHandledAlarmApi = (id:string,params:object) => {
  return http.get<any>(`/v2/alarm/${id}`, params);
}

export const getTrendDatasApi = (id:string,params:GetReviewParams) => {
  return http.get<any>(`/v2/trend/${id}`, params);
}
