import svmwebsocket from '@/utils/svm_webscoket'
import env from '../../../../env';
import { useUserState } from '@/store/userState';
const userState = useUserState();
export default class WSAPI extends svmwebsocket {
    STATUS_CODE = {
        SUCCESS: '00000'
    }
    static wsUrl: string = "";
    constructor() {
        super(WSAPI.wsUrl);
    }
    getDemoMonitorRecord(params: { hospitalId?: number, departmentId?: number, areaId?: number, viewType?: string, $page?: number, $limit: number ,bedCodes?: string,}) {
        let rqparams: any = {}
        if (params !== undefined && params.hospitalId !== undefined && params.hospitalId !== -1 && typeof params.hospitalId == 'number') {
            rqparams["hosIds"] = params.hospitalId
        }
        if (params !== undefined && params.departmentId !== undefined && params.departmentId !== -1 && typeof params.departmentId == 'number') {
            rqparams["deptId"] = params.departmentId
        }
        if (params !== undefined && params.areaId !== undefined && params.areaId !== -1 && typeof params.areaId == 'number') {
            rqparams["areaId"] = params.areaId
        }
        if (params.viewType !== undefined) {
            rqparams['viewType'] = params.viewType;
        }
        if (params.bedCodes !== undefined) {
            rqparams['bedIds'] = params.bedCodes
        }
        rqparams['$page'] = params.$page
        rqparams['$limit'] = params.$limit
        this.send({
            action: "show.getMonitorRecord",
            msg: rqparams
        });
    }

    getMvMonitorView(params: { hospitalId?: number, departmentId?: number ,areaId?:number ,viewType?:string}) {
        let rqparams: any = {};
        if (params !== undefined && params.hospitalId !== undefined && params.hospitalId !== -1 && typeof params.hospitalId == 'number') {
            rqparams["hospitalId"] = params.hospitalId
        }
        if (params !== undefined && params.departmentId !== undefined && params.departmentId !== -1 && typeof params.departmentId == 'number') {
            rqparams["departmentId"] = params.departmentId
        }
        if (params !== undefined && params.areaId !== undefined && params.areaId !== -1 && typeof params.areaId == 'number') {
            rqparams["areaId"] = params.areaId
        }
        if (params !== undefined && params.viewType !== undefined) {
            rqparams["viewType"] = params.viewType
        }
        this.send({
            action: "show2.getMonitorView",
            msg: rqparams
        });
    }
    onmessage(callback: (wsData: { action: string, msg: { code: string, msg: string, result: any } }) => void): void {
        super.onmessage((data) => {
            switch (data.action) {
                case "sys.close":
                    this.close();
                    break;
                default:
                    callback(data);
            }
        })
    }
}
//设置请求的基础路径
switch (env) {
    case 'dev':
        WSAPI.wsUrl = `ws://${location.host}/monitor?accessToken=${userState?.token}`;
        break;
    case 'test':
        WSAPI.wsUrl = `wss://${location.host}/monitor?accessToken=${userState?.token}`;
        break;
    case 'prod':
        WSAPI.wsUrl = `wss://XX.com/monitor?accessToken=${userState?.token}`;
        break;
}