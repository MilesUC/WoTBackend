#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { WotCdkBackStack } from "../lib/cdk-stack";
import { SharedVPCStack } from "../lib/shared-vpc-stack";

// load enviroment variables from env file
dotenv.config();

// set config from enviroment variables
const wotStage = process.env.WOT_STAGE;
const wotStageProd = process.env.WOT_STAGE_PROD;
const wotRegion = process.env.AWS_REGION;
const wotAccount = process.env.AWS_ACCOUNT_ID;
const wotLabel = process.env.LABEL;

const debug = wotStage == wotStageProd ? "disabled" : "enabled";

const app = new cdk.App();

// if the config are not present, throw error
if (wotStage && wotStageProd && debug && wotRegion && wotAccount && wotLabel) {
    const VPCStack = new SharedVPCStack(app, wotLabel, {
      env: {
        account: wotAccount,
        region: wotRegion,
      },
    });
  
    new WotCdkBackStack(
      app,
      wotStage,
      wotLabel,
      debug,
      wotStageProd,
      {
        env: {
          account: wotAccount,
          region: wotRegion,
        },
      }
    );
  } else {
    throw Error(
      "variable de entorno WOT_STAGE o AWS_REGION o AWS_ACCOUNT_ID no tiene valor"
    );
  }