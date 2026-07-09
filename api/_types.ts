export interface VercelRequest {
  method: string;
  query: {[key: string]: string | string[] | undefined};
  headers: {[key: string]: string | undefined};
  body?: any;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  setHeader(name: string, value: string): VercelResponse;
  send(data: string | Buffer): void;
  end(): void;
  json(data: any): void;
}
