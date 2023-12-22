import * as cdk from 'aws-cdk-lib';
import { BaseService } from "./BaseService";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { CfnOutput } from "aws-cdk-lib";

export class S3Service extends BaseService {
  private s3Bucket: s3.Bucket;
  constructor(scope: Construct, stageId: string) {
    super(scope, stageId);
    this.createS3Bucket();
  }

  private createS3Bucket() {
    // Aquí se crea un nuevo objeto S3 Bucket.
    // this: hace referencia a la instancia actual de S3BucketStack.
    // 'WOTBucket': es el identificador único para el objeto Bucket.
    this.s3Bucket = new s3.Bucket(this.scope, 'WOTUsersBucket', {
      // No se recomienda codificar un nombre para el depósito porque deben ser únicos a nivel mundial. Si dejamos el accesorio fuera, CloudFormation genera automáticamente un nombre
      // bucketName: 'my-bucket',
      // especifique lo que debería sucederle al depósito si se elimina la pila de CDK.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // vaciar automáticamente el contenido del depósito cuando se elimina nuestra pila.
      autoDeleteObjects: false,
      // se debe habilitar el control de versiones para el depósito S3
      versioned: true,
      // todos los objetos en el cubo deben ser de acceso público
      publicReadAccess: false,
      // especifique el tipo de cifrado del lado del servidor para los objetos almacenados
      encryption: s3.BucketEncryption.S3_MANAGED,
      // permite solicitudes HTTP de otros dominios
      // cors: [
      //   {
      //     allowedMethods: [
      //       s3.HttpMethods.GET,
      //       s3.HttpMethods.POST,
      //       s3.HttpMethods.PUT,
      //     ],
      //     allowedOrigins: ['http://localhost:3000'],
      //     allowedHeaders: ['*'],
      //   },
      // ],
      // nos permite hacer la transición a las que se accede con poca frecuencia a diferentes categorías de almacenamiento en un intento de ahorrar dinero
      // lifecycleRules: [
      //   {
      //     abortIncompleteMultipartUploadAfter: cdk.Duration.days(90),
      //     expiration: cdk.Duration.days(365),
      //     transitions: [
      //       {
      //         storageClass: s3.StorageClass.INFREQUENT_ACCESS,
      //         transitionAfter: cdk.Duration.days(30),
      //       },
      //     ],
      //   },
      // ],
      
    });

    new CfnOutput(this.scope, "BucketName", {
      value: this.s3Bucket.bucketName,
    });
  }
  public getS3Bucket() {
    return this.s3Bucket;
  }
}


