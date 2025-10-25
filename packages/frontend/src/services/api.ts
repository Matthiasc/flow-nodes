// API service for node types
export interface NodeType {
  id: string;
  description?: string;
  name: string;
}

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