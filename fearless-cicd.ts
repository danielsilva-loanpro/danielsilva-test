import { WorkflowConfig, StageTemplate } from 'fearless-cicd-v2';

//  AWS Deployment Stage Template

export const awsDeploy: StageTemplate = {
  name: 'aws-stage-template',
  setupActions: [
    {
      name: 'Configure AWS credentials',
      uses: 'aws-actions/configure-aws-credentials@v4',
      with: {
        'aws-region': '${{ inputs.aws-region }}',
        'role-to-assume': 'arn:aws:iam::685975343742:role/fearless-cicd-dummy-repo-deployment_role',
        'role-session-name': 'FearlessCICDSession'
      }
    }
  ],
  inputs: {
    'aws-region': { required: false, type: 'string', default: 'us-east-1' },
    'domain-owner': { required: true, type: 'string' }
  },
  actions: [
    {
      name: 'Publish',
      runOrder: 1,
      project: {
        buildSpec: {
          install: { commands: ['npm install'] },
          buildCommand: [
            'aws sts get-caller-identity',
            'VERSION=$(git describe --tags --abbrev=0 2>/dev/null | sed "s/v//" || echo "0.0.0")',
            'npm version $VERSION --no-git-tag-version --allow-same-version',
            'npm run build',
            'aws codeartifact login --tool npm --repository fearless-cicd-v2 --domain io-loanpro-api-v2 --domain-owner ${{ inputs.domain-owner }} --region ${{ inputs.aws-region }}',
            'npm publish --registry https://io-loanpro-api-v2-${{ inputs.domain-owner }}.d.codeartifact.${{ inputs.aws-region }}.amazonaws.com/npm/fearless-cicd-v2/'
          ]
        }
      }
    }
  ]
}


export const config: WorkflowConfig = {
  ProjectName: 'fearless-cicd-v2',
  PipelineStack: {
    Integration: {
      name: 'CI/CD Pipeline',
      branch: 'main',
      permissions: {
        contents: 'write',
        'id-token': 'write'
      },

      stageTemplates: [
        awsDeploy
      ],

      stages: [
        {
          name: 'Init_Stage',
          actions: [
            {
              name: 'Action1',
              runOrder: 1,
              project: {
                buildSpec: {
                  buildCommand: [
                    'echo "First action in the Init stage"',
                    'ls -l',
                  ]
                }
              }
            },
            {
              name: 'Action2 - Parallel',
              runOrder: 2,
              project: {
                buildSpec: {
                  buildCommand: [
                    'echo "Second action  - RUn order 2"',
                  ]
                }
              }
            },
            {
              name: 'Action3 - Parallel',
              runOrder: 2,
              project: {
                buildSpec: {
                  buildCommand: [
                    'echo "Third action  - RUn order 2"',
                  ]
                }
              }
            },
          ]
        },
      ]
    },
  }
};