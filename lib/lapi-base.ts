// Copyright 2020 Luke Shay. All rights reserved. MIT license.
/* @module lapi/lapi-base */

import type { ServerRequest } from "../deps.ts";

export type RequestHandler = (req: ServerRequest) => Promise<void> | void;
export type Middleware = (req: ServerRequest) => Promise<void> | void;

export enum RequestMethod {
  POST = "POST",
  GET = "GET",
  OPTIONS = "OPTIONS",
  DELETE = "DELETE",
  PUT = "PUT",
  HEAD = "HEAD",
  PATCH = "PATCH",
}

export type Route = {
  requestHandler: RequestHandler;
  requestMethod: RequestMethod;
  requestPath: string;
};

export interface LapiBaseOptions {
  middlewares?: Middleware[];
  routes?: Route[];
}

export class LapiBase {
  middlewares: Middleware[];
  routes: Route[];

  constructor(options?: LapiBaseOptions) {
    this.middlewares = options?.middlewares || [];
    this.routes = options?.routes || [];
  }

  addRoute(
    requestMethod: RequestMethod,
    path: string,
    handler: RequestHandler,
  ): void {
    this.routes.push(
      {
        requestMethod: requestMethod,
        requestPath: path,
        requestHandler: handler,
      },
    );
  }

  addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  post(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.POST, path, handler);
  }

  get(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.GET, path, handler);
  }

  put(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.PUT, path, handler);
  }

  delete(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.DELETE, path, handler);
  }

  options(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.OPTIONS, path, handler);
  }

  head(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.HEAD, path, handler);
  }

  patch(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.PATCH, path, handler);
  }

  findRoute({ method, url }: ServerRequest): Route | null {
    const matches = this.routes.filter((route) =>
      route.requestMethod === method &&
      route.requestPath === url
    );

    if (matches.length === 0) {
      return null;
    }

    return matches[0];
  }
}
