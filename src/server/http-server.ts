import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RouteHandler = (request: {
  req: IncomingMessage
  params: Record<string, string>
  query: URLSearchParams
  body: unknown
}) => Promise<unknown> | unknown

interface Route {
  method: HttpMethod
  path: string
  handler: RouteHandler
}

export class HttpServer {
  private routes: Route[] = []

  get(path: string, handler: RouteHandler) {
    this.registerRoute('GET', path, handler)
  }

  post(path: string, handler: RouteHandler) {
    this.registerRoute('POST', path, handler)
  }

  put(path: string, handler: RouteHandler) {
    this.registerRoute('PUT', path, handler)
  }

  delete(path: string, handler: RouteHandler) {
    this.registerRoute('DELETE', path, handler)
  }

  listen(port: number, host = '0.0.0.0') {
    const server = createServer(async (req, res) => {
      try {
        await this.handleRequest(req, res)
      } catch (error) {
        console.error(error)

        this.json(res, 500, {
          error: 'Internal server error',
        })
      }
    })

    server.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`)
    })

    return server
  }

  private registerRoute(
    method: HttpMethod,
    path: string,
    handler: RouteHandler,
  ) {
    this.routes.push({
      method,
      path,
      handler,
    })
  }

  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ) {
    const method = req.method as HttpMethod

    if (!req.url) {
      return this.json(res, 400, {
        error: 'Invalid request',
      })
    }

    const url = new URL(`http://localhost${req.url}`)

    const route = this.routes.find(
      (route) =>
        route.method === method &&
        route.path === url.pathname,
    )

    if (!route) {
      return this.json(res, 404, {
        error: 'Route not found',
      })
    }

    const body =
      method === 'POST' || method === 'PUT'
        ? await this.readJsonBody(req)
        : undefined

    const result = await route.handler({
      req,
      params: {},
      query: url.searchParams,
      body,
    })

    if (result === undefined) {
      return this.json(res, 204, null)
    }

    return this.json(res, 200, result)
  }

  private async readJsonBody(req: IncomingMessage): Promise<unknown> {
    const rawBody = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      req.on('data', (chunk: Buffer) => {
        chunks.push(Buffer.from(chunk))
      })
      req.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })
      req.on('error', reject)
    })

    if (rawBody.length === 0) {
      return undefined
    }

    try {
      return JSON.parse(rawBody)
    } catch {
      throw new Error('Invalid JSON body')
    }
  }

  private json(
    res: ServerResponse,
    statusCode: number,
    data: unknown,
  ) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
    })

    res.end(JSON.stringify(data))
  }
}
