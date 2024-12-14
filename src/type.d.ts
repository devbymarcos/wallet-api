import { Response } from "express";

declare module "express-serve-static-core" {
  interface Response {
    locals: {
        userAuth:{
            id?:string
        }; 
      
    };
  }
}
