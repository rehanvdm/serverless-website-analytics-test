#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { App } from '../lib/app';
import {Tags} from "aws-cdk-lib";

const app = new cdk.App();

const swaStack = new App(app, 'swa-test', {
  env: {
    account: '581184285249', // Rehan's demo account
    region: 'us-east-1',
  },
});

/* Adds tags to all the resources for billing purposes */
Tags.of(swaStack).add('App', 'swa-demo');