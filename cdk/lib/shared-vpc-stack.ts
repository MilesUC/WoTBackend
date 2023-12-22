import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import all AWS services that will be used
import { VPCService } from "./services/VPCService";

export class SharedVPCStack extends cdk.Stack {
  // creates a constructor that will be shared with all the services
  private vpcService: VPCService;
  constructor(scope: Construct, label: string, props?: cdk.StackProps) {
    super(scope, `shared-${label}-users-stack`, props);
    const stageId = `shared-${label}-users`;

    this.vpcService = new VPCService(this, stageId);
  }

  public getVPCService() {
    return this.vpcService;
  }
}
