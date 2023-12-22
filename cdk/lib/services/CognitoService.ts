import * as dotenv from "dotenv";

import { BaseService } from "./BaseService";
import { Construct } from "constructs";
import {
  StringAttribute,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
  UserPoolIdentityProviderGoogle,
  ProviderAttribute,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { CfnOutput, Duration, SecretValue } from "aws-cdk-lib";

dotenv.config();

export class CognitoService extends BaseService {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private userPoolDomain: UserPoolDomain;
  private googleIdentityProvider: UserPoolIdentityProviderGoogle;
  constructor(scope: Construct, stageId: string) {
    super(scope, stageId);
    this.createUserPool();
  }
  private createUserPool() {
    // Creates an user pool, setting the signinAliases
    this.userPool = new UserPool(this.scope, `${this.stageId}-wot-users-userpool`, {
      userPoolName: `${this.stageId}-wot-users-userpool`,
      selfSignUpEnabled: true,

      customAttributes: {
        member_status: new StringAttribute(),
      },
      signInAliases: {
        email: true,
        phone: false,
        username: false,
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(7),
      },
    });

    // set the user pool client, and the authflows allowed
    this.userPoolClient = new UserPoolClient(
      this.scope,
      `${this.stageId}-wot-users-userpoolClient`,
      {
        accessTokenValidity: Duration.days(1),
        refreshTokenValidity: Duration.days(365),
        idTokenValidity: Duration.days(1),
        userPool: this.userPool,
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
        supportedIdentityProviders: [
          UserPoolClientIdentityProvider.COGNITO,
          UserPoolClientIdentityProvider.GOOGLE,
        ],
        oAuth: {
          callbackUrls: [
            "http://localhost:5000/perfil",
            "http://localhost:5000/login",
            `${process.env.URL_WEB}/perfil`,
            `${process.env.URL_WEB}/login`
          ],
        },
      }
    );

    this.userPoolDomain = new UserPoolDomain(this.scope, "UserPoolDomain", {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: `${this.stageId}-users-wot`,
      },
    });

    // Configure the Google Identity Provider
    this.googleIdentityProvider = new UserPoolIdentityProviderGoogle(
      this.scope,
      "Google",
      {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        // Se supone que no se debería hacer, pero se está haciendo en la configuración de el RDS también
        // Leer https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html
        clientSecretValue: SecretValue.unsafePlainText(
          process.env.GOOGLE_CLIENT_SECRET || ""
        ),
        userPool: this.userPool,
        scopes: ["profile", "email", "openid"],
        attributeMapping: {
          email: ProviderAttribute.GOOGLE_EMAIL,
          givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
        },
      }
    );

    // CfnOutput is used to print the user pool id and client id after the stack is deployed
    // it doesn't do any actual changes to the stack
    new CfnOutput(this.scope, "UserPoolId", {
      value: this.userPool.userPoolId,
    });

    new CfnOutput(this.scope, "CognitoClientID", {
      value: this.userPoolClient.userPoolClientId,
    });

    new CfnOutput(this.scope, "CognitoDomain", {
      value: this.userPoolDomain.domainName,
    });
  }

  // Since the user pool and client are private, we need to create a getter to access them from other services
  public getUserPool() {
    return this.userPool;
  }
  public getUserPoolId() {
    return this.userPool.userPoolId;
  }
  public getUserPoolClientId() {
    return this.userPoolClient.userPoolClientId;
  }
  public getUserPoolDomain() {
    return this.userPoolDomain.domainName;
  }
}
