export class UserModel {
    userId:number = 0;
    fullName: string = '';
    grade: string = '';
    email: string = '';
    designation: string = '';
    employeeCode: string = '';
    createdBy: any;
    depId:number = 0;
    updatedBy: number = 0;
    branch: {
      branchId: number;
    } = { branchId: 0 }; 
    
    region: {
      regionId: number;
    } = { regionId: 0 };  
    
    userType: {
      type: string;
    } = { type: '' };  
    
    status: string = '';
  }
  
  