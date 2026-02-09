import { WorkflowConfig } from 'fearless-cicd-v2';

export const config: WorkflowConfig = {
  projectName: 'my-project',
  
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
      action2action2: {
        name: 'Satge2 - Action2',
        needs: 'test',
        steps: [
          { run: 'echo "Satge2 - Action2"' },
          { run: 'ls -la' },
        ]
      },
      
      action4: {
        name: 'Satge3 - Action1',
        needs: ['action2', 'action2'],
        steps: [
          { run: 'echo "Satge3 - Action1"' },
          { run: 'ls -la' },
        ]
      },
    }
  },
};