import { users, kpiData, type User, type InsertUser, type KpiData, type InsertKpiData } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getKpiData(): Promise<KpiData>;
  updateKpiData(data: Partial<InsertKpiData>): Promise<KpiData>;
  incrementTotalCalls(): Promise<KpiData>;
  incrementDealCalls(): Promise<KpiData>;
  incrementNoDealCalls(): Promise<KpiData>;
  incrementPositiveSentimentCalls(): Promise<KpiData>;
  incrementNegativeSentimentCalls(): Promise<KpiData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private kpiDataStore: KpiData;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.kpiDataStore = {
      id: 1,
      totalCalls: 0,
      dealCalls: 0,
      noDealCalls: 0,
      positiveSentimentCalls: 0,
      negativeSentimentCalls: 0,
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getKpiData(): Promise<KpiData> {
    return { ...this.kpiDataStore };
  }

  async updateKpiData(data: Partial<InsertKpiData>): Promise<KpiData> {
    this.kpiDataStore = { ...this.kpiDataStore, ...data };
    return { ...this.kpiDataStore };
  }

  async incrementTotalCalls(): Promise<KpiData> {
    this.kpiDataStore.totalCalls++;
    return { ...this.kpiDataStore };
  }

  async incrementDealCalls(): Promise<KpiData> {
    this.kpiDataStore.dealCalls++;
    return { ...this.kpiDataStore };
  }

  async incrementNoDealCalls(): Promise<KpiData> {
    this.kpiDataStore.noDealCalls++;
    return { ...this.kpiDataStore };
  }

  async incrementPositiveSentimentCalls(): Promise<KpiData> {
    this.kpiDataStore.positiveSentimentCalls++;
    return { ...this.kpiDataStore };
  }

  async incrementNegativeSentimentCalls(): Promise<KpiData> {
    this.kpiDataStore.negativeSentimentCalls++;
    return { ...this.kpiDataStore };
  }
}

export const storage = new MemStorage();
