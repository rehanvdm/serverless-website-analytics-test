import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cert from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as sns from 'aws-cdk-lib/aws-sns';
// import {Swa} from "serverless-website-analytics/src"; // For the npm linked package one while testing
import {AllAlarmTypes, Swa} from 'serverless-website-analytics';

export class App extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* Optional, see descriptions on the `domain` property below. Needs tp cover the `domain.name` and
       {auth.cognito.loginSubDomain}.{domain.name}` domains and must be in us-east-1 even if your stack is
       somewhere else  */
    const wildCardCertUsEast1 = cert.Certificate.fromCertificateArn(this, 'Cert',
        'arn:aws:acm:us-east-1:581184285249:certificate/62ff8b37-6710-4838-999a-7d7676a068ae');

    const alarmTopic = new sns.Topic(this, "alarm-topic");
    new sns.Subscription(this, "alarm-topic-subscription", {
      topic: alarmTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: 'rehan.vdm4@gmail.com',
    });

    new Swa(this, 'swa-demo', {
      environment: 'prod',
      awsEnv: {
        account: this.account,
        region: this.region,
      },
      sites: [
        'simulated',
      ],

      allowedOrigins: ['*'],
      /* Can be set explicitly instead of allowing all */
      // allowedOrigins: [
      //   'https://example.com',
      //   'https://www.example.com',
      //   'http://localhost:3000',
      //   'tests1',
      //   'tests2',
      // ],

      /* Specify one or the other, not both. Specifying neither means the site is unauthenticated, which is what we
         want for the Demo. */
      // auth: {
      //   basicAuth: {
      //     username: 'WelcomeFriend',
      //     password: 'YouMayPass',
      //   },
      // },
      // auth: {
      //   cognito: {
      //     loginSubDomain: 'login', // This has to be unique across Cognito if not specifying your own domain
      //     users: [{
      //       name: '<full name>',
      //       email: '<name@mail.com>',
      //     }]
      //   }
      // },

      /* Optional, if not specified uses default CloudFront and Cognito domains */
      domain: {
        name: 'demo.serverless-website-analytics.com',
        usEast1Certificate: wildCardCertUsEast1,
        /* Optional, if not specified then no DNS records will be created. You will have to create the DNS records yourself. */
        hostedZone: route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
          hostedZoneId: 'Z00387321EPPVXNC20CIS',
          zoneName: 'demo.serverless-website-analytics.com',
        }),
        trackOwnDomain: true,
      },
      isDemoPage: true, /* Do not specify for your dashboard */

      observability: {
        dashboard: true,
        alarms: {
          alarmTopic,
          alarmTypes: AllAlarmTypes
        },
      },
      anomaly: {
        alert: {
          topic: alarmTopic,
        }
      }
    });

  }
}


