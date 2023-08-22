export interface ConnectionItem {
  name: string;
  key: string;
  status: string;
  token: string;
  port: number;
  host?: string;
  https?: boolean;
}
