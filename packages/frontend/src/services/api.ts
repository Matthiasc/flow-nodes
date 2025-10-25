// API service for node types
export interface NodeType {
  id: string;
  description?: string;
  name: string;
}

export interface WorkFlow {
  id: string;
  name?: string;
  status: 'active' | 'inactive';
}

export interface WorkFlowDetail extends WorkFlow {
  nodes: NodeType[];
}

const newWorkFlow: Omit<WorkFlow, 'id'> = {
  name: 'New Workflow',
  status: 'inactive',
};

export async function getNodeTypes(): Promise<NodeType[]> {
  // This would be your actual API call
  // return await fetch('/api/node-types').then(res => res.json())

  // Simulated API call for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'test-node', description: 'test node', name: 'test node' },
        { id: 'test-node-2', description: 'test node 2', name: 'test node 2' },
      ]);
    }, 1000);
  });
}

export async function createNodeType(nodeType: Omit<NodeType, 'id'>): Promise<NodeType> {
  // POST request to create new node type
  throw new Error('Not implemented');
}

export async function updateNodeType(id: string, nodeType: Partial<NodeType>): Promise<NodeType> {
  // PUT/PATCH request to update node type
  throw new Error('Not implemented');
}

export async function deleteNodeType(id: string): Promise<void> {
  // DELETE request
  throw new Error('Not implemented');
}


export async function getWorkflows(): Promise<WorkFlow[]> {
  // This would be your actual API call
  // return await fetch('/api/workflows').then(res => res.json())

  // Simulated API call for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Workflow 1', status: 'active' },
        { id: '2', name: 'Workflow 2', status: 'inactive' },
      ]);
    }, 1000);
  });
}

export async function createNewWorkflow(): Promise<WorkFlow> {
  // POST request to create new workflow

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Math.random().toString(), ...newWorkFlow });
    }, 500);
  })

};

export function getWorkFlowById(id: string): Promise<WorkFlowDetail | null> {
  // GET request to fetch a workflow by ID
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `Workflow ${id}`, status: 'active', nodes: [] });
    }, 500);
  });
}
