import { http } from '@/utils/axios'
interface authorizeParams {
    username: string
    password: string
    client_id: string
    client_secret: string
    scope: string
    state: string
    display: string
}

interface accessTokenParams {
    client_id: string
    client_secret: string
    code: string
    grant_type: string
}

export const loginParams = {
    "client_id" : 'BC19KEFj',
    "client_secret" : '2958755c775c523a2720b58eab6843468262120d',
    "scope" : 'scope_login',
    "state" : 'svm-tech',
    "display" : 'web',
    "grant_type" : 'authorization_code'
}
export const authorize = (requestData: authorizeParams) => {
    return http.post('/oauth2/authorize?username='+ requestData["username"]+'&password='+requestData["password"]+'&client_id='
          +requestData.client_id+'&scope='+requestData.scope+'&state='+requestData.state+'&display='+requestData.display)
}

export const accessToken = (requestData: accessTokenParams) => {
    return http.post('/oauth/3333/accessToken?code='+ requestData.code+'&client_id='+requestData.client_id+'&client_secret='
          +requestData.client_secret+'&grant_type='+requestData.grant_type)
}

export const refreshToken = (refresh_token:string) => {
    var requestData = JSON.parse(JSON.stringify(loginParams));
    requestData["grant_type"] = 'refresh_token';
    return http.post("/oauth2/refreshToken?grant_type="+ requestData.grant_type+'&client_id='
    +requestData.client_id+'&refresh_token='+refresh_token)
}

export const logOut = () => {
    return http.post('/oauth2/2jjj/revokeToken');
}

export const userInfo = () => {
    return http.get('/v2/kkk/info');
}