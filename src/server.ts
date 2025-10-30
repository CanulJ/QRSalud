import { AngularAppEngine, createRequestHandler } from '@angular/ssr';


const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  

  // Aquí puedes definir endpoints API si quieres
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request);
  return result || new Response('Not found', { status: 404 });
}

/**
 * Handler que Angular CLI usa durante build o dev server
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
