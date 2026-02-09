import { WorkflowConfig, ReusableWorkflowTemplate } from 'fearless-cicd-v2';

const deployTemplate: ReusableWorkflowTemplate = {
    name: 'deploy-template',
    inputs: {
        foo: { required: true, type: 'string' },
        bar: { required: false, type: 'boolean', default: false }
    },
    jobs: {
        deployInitSetup: {
            name: 'deployInitSetup',
            steps: [
                { uses: 'actions/checkout@v4' },
                { run: 'echo "foo ${{ inputs.foo }}"' },
                { run: 'echo "bar ${{ inputs.bar }}"' },
                { run: 'echo "deploy init setup"' }
            ]
        },
        deployApp: {
            name: 'deployApp',
            needs: 'deployInitSetup',
            steps: [
                { uses: 'actions/checkout@v4' },
                { run: 'echo "foo ${{ inputs.foo }}"' },
                { run: 'echo "bar ${{ inputs.bar }}"' },
                { run: 'echo "deploy app"' }
            ]
        },
    }
}

export const config: WorkflowConfig = {
  projectName: 'my-project',
  reusableWorkflows: [
    deployTemplate
  ],
  integration: {
    name: 'Integration PL',
    trigger: {
      push: { branches: ['main'] }
    },
    permissions: {
      contents: 'write',
      'id-token': 'write'
    },
    jobs: {
      test: {
        name: 'Checkout Action',
        steps: [
          { uses: 'actions/checkout@v4' },
          { run: 'echo "Checkout action"' },
          { run: 'ls -la' },
        ]
      },
      
      action2: {
        name: 'Satge2 - Action1',
        needs: 'test',
        steps: [
          { run: 'echo "Satge2 - Action1"' },
          { run: 'ls -la' },    
        ]
      },
      action3: {
        name: 'Satge2 - Action2',
        needs: 'test',
        steps: [
          { run: 'echo "Satge2 - Action2"' },
          { run: 'ls -la' },
        ]
      },
      
      action4: {
        name: 'Satge3 - Action1',
        needs: ['action2', 'action3'],
        steps: [
          { run: 'echo "Satge3 - Action1"' },
          { run: 'echo "foo"' },
          { run: 'ls -la' },
        ]
      },

      deploy_alpha: {
        name: 'Deploy Foo1',
        reusableWorkflow: deployTemplate.name,
        needs: 'action4',
        with: { 
            foo: 'alpha',
            bar: true 
        },
      },
      deploy_beta: {
        name: 'Deploy Foo2',
        reusableWorkflow: deployTemplate.name,
        needs: 'action4',
        with: { 
            foo: 'beta',
            bar: false 
        },
      },
    }
  },
};