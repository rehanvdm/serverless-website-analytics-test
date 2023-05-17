#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessWebsiteAnalyticsTestStack } from '../lib/serverless-website-analytics-test-stack';

const app = new cdk.App();

new ServerlessWebsiteAnalyticsTestStack(app, 'ServerlessWebsiteAnalyticsTestStack', {
  env: { region: 'us-east-1' },
});