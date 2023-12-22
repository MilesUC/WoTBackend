import { Construct } from "constructs";
import { BaseService } from "./BaseService";
import { Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";

export class VPCService extends BaseService {
  // set the credentials from the environment variables
  private PVC: Vpc;
  // private securityGroup: SecurityGroup;

  constructor(scope: Construct, stageId: string) {
    super(scope, stageId);
    this.createVPC();
  }

  private createVPC() {
    // creates a VPC with 2 availability zones
    this.PVC = new Vpc(this.scope, "WotUsersVPC", {
      maxAzs: 2, // Adjust the number of availability zones as per your requirements
      natGateways: 1, // Adjust the number of NAT gateways as per your requirements
    });

    // // creates the security group for RDS instance
    // this.securityGroup = new SecurityGroup(this.scope, "RDSSecurityGroup", {
    //   vpc: this.PVC,
    //   allowAllOutbound: true, // Allow outbound traffic
    // });

    // // Add inbound rules to the security group
    // this.securityGroup.addIngressRule(
    //   Peer.anyIpv4(), // Allow inbound traffic from any IPv4 address
    //   Port.tcp(3306) // Allow inbound traffic on port 3306 (assuming MySQL)
    // );
  }

  public getVPC() {
    return this.PVC;
  }
  // public getSecurityGroup() {
  //   return this.securityGroup;
  // }

  // Since the RDS instance is private, we need to create a getter to access it from other services
}
