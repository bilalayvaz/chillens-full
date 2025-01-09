// src/types/express.d.ts
declare module 'express' {
    export interface Application {
      use: any;
      listen: any;
    }
  }