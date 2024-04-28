declare namespace Express {
  interface Request {
    ipAddr: string;
    user: import('./models/user-detail.model').default;
    requestId: string;
  }
}
