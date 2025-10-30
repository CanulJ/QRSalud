import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context.mjs';

const angularAppEngine = new AngularAppEngine();

/**
 * Handler principal para Netlify
 */
export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Definir rutas dinámicas que no se prerenderizan
  if (pathname.startsWith('/acceso/')) {
    context.renderMode = 'dynamic'; // <- evita prerendering
  }

  // Puedes agregar endpoints de API aquí si quieres
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

/**
 * Handler que Angular CLI usa durante build o dev server
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
