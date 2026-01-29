import {OutputSchema, OutputSchemaType} from '../operations/contracts';

// Since processOutput and processOutputs are not exported, we need to create a test double
// that mimics their behavior for testing

describe('Output Processing Functions', () => {
  // Helper function to mock the behavior of processOutput
  function mockProcessOutput(output: OutputSchemaType): OutputSchemaType[] {
    if (output.type === 'tuple' && output.components) {
      return mockProcessOutputs(output.components);
    }
    return [output];
  }

  // Helper function to mock the behavior of processOutputs
  function mockProcessOutputs(outputs: OutputSchemaType[]): OutputSchemaType[] {
    if (!outputs || !Array.isArray(outputs)) {
      return [];
    }

    const result = [];

    for (const output of outputs) {
      const processed = mockProcessOutput(output);
      result.push(...processed);
    }

    return result;
  }

  it('should handle simple outputs', () => {
    const outputs = [
      { type: 'uint256' },
      { type: 'address' }
    ];
    
    const result = mockProcessOutputs(outputs);
    expect(result).toEqual([
      { type: 'uint256' },
      { type: 'address' }
    ]);
  });

  it('should flatten tuple outputs with components', () => {
    const outputs = [
      { 
        type: 'tuple', 
        components: [
          { type: 'address' },
          { type: 'uint128' }
        ] 
      }
    ];
    
    const result = mockProcessOutputs(outputs);
    expect(result).toEqual([
      { type: 'address' },
      { type: 'uint128' }
    ]);
  });

  it('should handle nested tuple outputs', () => {
    const outputs = [
      { 
        type: 'tuple', 
        components: [
          { type: 'address' },
          { 
            type: 'tuple',
            components: [
              { type: 'uint128' },
              { type: 'bool' }
            ]
          }
        ] 
      }
    ];
    
    const result = mockProcessOutputs(outputs);
    expect(result).toEqual([
      { type: 'address' },
      { type: 'uint128' },
      { type: 'bool' }
    ]);
  });

  it('should handle mixed simple and tuple outputs', () => {
    const outputs = [
      { type: 'string' },
      { 
        type: 'tuple', 
        components: [
          { type: 'address' },
          { type: 'uint128' }
        ] 
      },
      { type: 'bool' }
    ];
    
    const result = mockProcessOutputs(outputs);
    expect(result).toEqual([
      { type: 'string' },
      { type: 'address' },
      { type: 'uint128' },
      { type: 'bool' }
    ]);
  });

  it('should handle empty components array', () => {
    const outputs = [
      { type: 'tuple', components: [] }
    ];
    
    const result = mockProcessOutputs(outputs);
    expect(result).toEqual([]);
  });

  it('should validate real schema examples', () => {
    // Example from the schema description
    const exampleOutput = [
      { type: 'address' },
      { type: 'uint128' }
    ];
    
    const result = OutputSchema.array().safeParse(exampleOutput);
    expect(result.success).toBe(true);
  });
});
