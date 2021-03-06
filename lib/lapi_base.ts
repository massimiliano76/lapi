// Copyright 2020 Luke Shay. All rights reserved. MIT license.
/* @module lapi/lapi_base */

import type { Request } from "./request.ts";

export type RequestHandler = (req: Request) => Promise<void> | void;
export type Middleware = (req: Request) => Promise<void> | void;

export enum RequestMethod {
  POST = "POST",
  GET = "GET",
  OPTIONS = "OPTIONS",
  DELETE = "DELETE",
  PUT = "PUT",
  HEAD = "HEAD",
  PATCH = "PATCH",
}

export interface Route {
  requestHandler: RequestHandler;
  requestMethod: RequestMethod;
  requestPath: string;
}

export interface LapiBaseOptions {
  middlewares?: Middleware[];
  routes?: Route[];
  timer?: boolean
}

/** Base class to be used if you need a class that supports middlewares and routes. */
export class LapiBase {
  middlewares: Middleware[];
  routes: Route[];
  timer = false;

  /** Constructs a LapiBase class */
  constructor(options?: LapiBaseOptions) {
    this.middlewares = options?.middlewares || [];
    this.routes = options?.routes || [];
    this.timer = options?.timer || false;
  }

  /** Adds a request handler for the given method and path. */
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

  /** Adds a middleware that is to be ran before the request handler. */
  addMiddleware(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  /** Adds a `POST` route. */
  post(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.POST, path, handler);
  }

  /** Adds a `GET` route. */
  get(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.GET, path, handler);
  }

  /** Adds a `PUT` route. */
  put(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.PUT, path, handler);
  }

  /** Adds a `DELETE` route. */
  delete(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.DELETE, path, handler);
  }

  /** Adds an `OPTIONS` route. */
  options(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.OPTIONS, path, handler);
  }

  /** Adds a `HEAD` route. */
  head(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.HEAD, path, handler);
  }

  /** Adds a `PATCH` route. */
  patch(path: string, handler: RequestHandler): void {
    this.addRoute(RequestMethod.PATCH, path, handler);
  }

  /** Runs all middleware on the passed in request. */
  async runMiddleware(request: Request): Promise<void> {
    if (this.timer) request.logger.time("middleware");
    for (const middleware of this.middlewares) {
      await middleware(request);
    }
    if (this.timer) request.logger.timeEnd("middleware");
  }

  /** Loops through the routes to find the handler for the given request.  */
  findRoute({ method, url }: Request): Route | null {
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
