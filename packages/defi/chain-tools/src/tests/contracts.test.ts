import { 
  InputSchema, 
  OutputSchema 
} from '../operations/contracts';

describe('Zod Schemas', () => {
  describe('InputSchema', () => {
    it('should validate correct input schema', () => {
      const validInput = { type: 'uint256', value: '123' };
      const result = InputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject input without type', () => {
      const invalidInput = { value: '123' };
      const result = InputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('OutputSchema', () => {
    it('should validate correct output schema', () => {
      const validOutput = { type: 'uint256' };
      const result = OutputSchema.safeParse(validOutput);
      expect(result.success).toBe(true);
    });

    it('should validate nested output schema with components', () => {
      const validOutput = { 
        type: 'tuple', 
        components: [
          { type: 'address' },
          { type: 'uint128' }
        ] 
      };
      const result = OutputSchema.safeParse(validOutput);
      expect(result.success).toBe(true);
    });

    it('should reject output without type', () => {
      const invalidOutput = { components: [] };
      const result = OutputSchema.safeParse(invalidOutput);
      expect(result.success).toBe(false);
    });
  });
});
