export class IncidentModel{
    incidentId :number=0;
    createdBy: number = 0;
    updatedBy:number=0;
    inc_description:string='';
    occurence_date:string='';
    detected_date: string='';
    reporting_date:string='';
    risk_owner:string='';
    risk_cause: string='';
    sub_category: string='';
    sub_type: any;
    branch: any;
    region: any;
    currentLevel:string='';
    created_Level:string='';
    status:string='';
    incidentRef:string='';
    next_level:string='';
    contact_number:string;
    reporting_officer:string;
    recovery_action:string;
    recoverd_amount:number=0;
    account_number:number=0;
    actual_amount:number=0;
    potential_amount:number=0;
    level:string='';
    branchId:number=0;
    regionId:number=0;
    depId:number=0;
    email:string='';
    
}