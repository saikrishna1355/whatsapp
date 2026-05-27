export interface UserSession {
  phoneNumber: string;
  module: string;
  step: string;
  context: Record<string, unknown>;
  updatedAt: Date;
}
