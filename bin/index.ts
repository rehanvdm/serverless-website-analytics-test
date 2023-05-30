#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { App } from '../lib/app';

const app = new cdk.App();

new App(app, 'swa-test', {
  env: {
    account: '581184285249', // Rehan's demo account
    region: 'us-east-1',
  },
});