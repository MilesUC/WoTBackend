import { BaseService } from "./BaseService";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { Function, Runtime, AssetCode } from "aws-cdk-lib/aws-lambda";
import { Effect, ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import path = require("path");

interface IWotLogicLambdaParams {
  region?: string;
  account?: string;
  isProd: boolean;
  env: {
    [key: string]: string;
  };
  s3Bucket: s3.Bucket;
}

export class LambdaService extends BaseService {
  private WotLambdaBackend: NodejsFunction
  constructor(scope: Construct, stageId: string) {
    super(scope, stageId);
  }

  // Lambda - Py
  public createWotLogicLambdaNode(params: IWotLogicLambdaParams) {
    const functionCodePath = path.join(__dirname, "..", "..", ".."); // Path to the code directory

    const excludedFilesAndFolders = [
      "cdk/**", // Exclude all files and folders under the 'cdk' directory
      "recomendation-model/**", // Exclude all files and folders under the 'recomendation-model' directory
    ];

    // Creates the lambda function, using Node 18
    this.WotLambdaBackend = new Function(this.scope, "Wot-users-api-lambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "src/handler.handler", // Path to the handler function
      code: new AssetCode(functionCodePath, {
        // Pass the code directory to AssetCode, along with the exclude option
        exclude: excludedFilesAndFolders,
      }),
      memorySize: 640, // set the memory size to 640 MB
      timeout: Duration.minutes(8), // set the timeout to 8 minutes
      environment: { ...params.env }, // set the enviroment variables that were passed to the function in wot-cdk-back-stack.ts
    });

    // // allow the lambda to access the RDS instance
    // this.WotLambdaBackend.role?.addToPrincipalPolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ["rds:*"],
    //     resources: [
    //       `arn:aws:rds:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:db:*`,
    //     ],
    //   })
    // );

    // set needed policies to the lambda, so it can access the Cognito user pool and create users
    const policies = [
      "service-role/AWSLambdaBasicExecutionRole",
      "AmazonCognitoReadOnly",
      "AmazonCognitoPowerUser",
    ];

    for (let policy of policies) {
      this.WotLambdaBackend.role?.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName(policy)
      );
    }

    // allow the lambda to access the S3 bucket
    // Se concede acceso de lectura al bucket a la cuenta raíz de AWS.
    // TODO: Queremos solo lectura o lectura y escritura?
    params.s3Bucket.grantRead(this.WotLambdaBackend);

    // Otorgar permisos de escritura en un depósito S3 a una función lambda
    params.s3Bucket.grantWrite(this.WotLambdaBackend);
  }

  // Since the lambda is private, we need to create a getter to access it from other services
  public getLambdaNodeJSFunction() {
    return this.WotLambdaBackend;
  }
}
