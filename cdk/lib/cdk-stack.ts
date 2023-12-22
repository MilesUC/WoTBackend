import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';


// import all AWS services that will be used
import { LambdaService } from "./services/LambdaService";
import { ApiGatewayService } from "./services/ApiGatewayService";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { S3Service } from "./services/S3Service";
import * as s3 from "aws-cdk-lib/aws-s3";
import { VPCService } from "./services/VPCService";
import { CognitoService } from "./services/CognitoService";

export class WotCdkBackStack extends cdk.Stack {
  // creates a constructor that will be shared with all the services
  constructor(
    scope: Construct,
    stage: string,
    label: string,
    debug: string,
    stageProd: string,
    props?: cdk.StackProps
  ) {
    super(scope, `${stage}-${label}-users-stack`, props);
    const stageId = `${stage}-${label}`;

    const isProd = stage == stageProd;

    const restApi = new ApiGatewayService(this, stageId);

    const s3Service = new S3Service(this, stageId);

    // Cognito
    const cognito = new CognitoService(this, stageId);
    const userPool = cognito.getUserPool();

    // Lamdba
    // Lamdba - Parameters
    const lambdaParameters = {
      isProd: isProd,
      region: this.region,
      account: this.account,
      s3Bucket: s3Service.getS3Bucket(),
    };
    // Lamdba - Enviroment
    const lambdaCommonEnv = {
      DEBUG: debug,
      WOT_STAGE: stage,
      WOT_LABEL: label,
      // // get url endpoint from the RDS service and pass it to the lambda
      // DB_HOST: rdsService.getInstancecEndpoint() ?? "localhost",
      // set the DB user and password
      DB_HOST: process.env.DB_HOST ?? "localhost",
      DB_USER: process.env.DB_USER ?? "mysql",
      DB_PASSWORD: process.env.DB_PASSWORD ?? "mysql",
      DB_NAME: process.env.DB_NAME ?? "wot",
      DB_DRIVER: process.env.DB_DRIVER ?? "mysql",
      DB_PORT: process.env.DB_PORT ?? "3306",
      // set cognito user pool id and client id
      USER_POOL_ID: cognito.getUserPoolId(),
      CLIENT_ID: cognito.getUserPoolClientId(),
      COGNITO_DOMAIN: cognito.getUserPoolDomain(),
      S3_BUCKET_NAME: s3Service.getS3Bucket().bucketName,
    };

    // Lamdba - Payloads
    // pass the parameters and enviroment variables to the lambda
    const payloadPyFunctions = {
      ...lambdaParameters,
      env: {
        ...lambdaCommonEnv,
      },
    };

    // Lambda - Service
    // creates the lambda service
    const lambdaService = new LambdaService(this, stageId);

    // creates the lambda function with the parameters and enviroment variables
    lambdaService.createWotLogicLambdaNode(payloadPyFunctions);

    // get tha lambda function object to use it later
    const lambdaFunction: NodejsFunction =
      lambdaService.getLambdaNodeJSFunction();

    //creates an restapi with the lambda function and the user pool
    restApi.createLambdaRestAPI(lambdaFunction, userPool);
  }
}
