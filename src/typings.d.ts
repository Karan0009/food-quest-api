declare namespace Express {
  interface Request {
    ipAddr: string;
    user: any;
    requestId: string;
  }
}
