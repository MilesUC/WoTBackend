import { BaseService } from "./BaseService";
import { Construct } from "constructs";
import { IRestApi, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction, Function } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";


import { UserPool } from "aws-cdk-lib/aws-cognito";

export class ApiGatewayService extends BaseService {
  private restApi: IRestApi;
  constructor(scope: Construct, stageId: string) {
    super(scope, stageId);
  }
  public createLambdaRestAPI(wotApiRest: Function, userPool: UserPool) {
    const wotLogicLambdaPyId = "wotUsersRestAPI";

    // const authorizer = new CognitoUserPoolsAuthorizer(
    //   this.scope,
    //   "Authorizer",
    //   {
    //     cognitoUserPools: [userPool],
    //     identitySource: "method.request.header.Authorization",
    //   }
    // );

    //lambda that handle the api rest
    const apiLambda = new LambdaRestApi(
      this.scope,
      `${wotLogicLambdaPyId}-usersRestAPIGateway`,
      {
        handler: wotApiRest as unknown as IFunction,
        restApiName: `${this.stageId}-wotUsersAPIGateway`,
        deployOptions: {
          stageName: this.stageId,
        },
        // when set to false, every request to the api needs to be explicitly defined here in the cdk
        // proxy: false,
      }
    );

    // Add IAM permissions for creating Cognito users
    const cognitoPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["*"],
      resources: [
        `arn:aws:cognito-idp:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:userpool/${userPool.userPoolId}`,
      ],
    });

    wotApiRest.role?.addToPrincipalPolicy(cognitoPolicy);

  }

  public getAPIGateway() {
    return this.restApi;
  }

  public getAPIGatewayId() {
    return this.restApi.restApiId;
  }
}
export interface IApiGatewayService {
  createLambdaRestAPI: (wotApiRest: IFunction) => void;
}
