// This is a frontend-only calculator, so no storage is needed
// But keeping the file for consistency with the template structure

export interface IStorage {
  // No storage operations needed for this calculator
}

export class MemStorage implements IStorage {
  constructor() {
    // No initialization needed
  }
}

export const storage = new MemStorage();