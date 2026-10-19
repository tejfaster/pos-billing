
const BACKEND_URL = "https://pos-backend-ffx8.onrender.com";

export default {
  async fetch(request, env) {
    const incomingUrl = new URL(request.url);

    // Forward API requests to Render.
    if (
      incomingUrl.pathname === "/api" ||
      incomingUrl.pathname.startsWith("/api/")
    ) {
      const backendUrl = new URL(
        incomingUrl.pathname + incomingUrl.search,
        BACKEND_URL
      );

      const headers = new Headers(request.headers);

      // The browser communicates with this Worker,
      // so preserve the original frontend origin.
      headers.set("X-Forwarded-Host", incomingUrl.host);
      headers.set("X-Forwarded-Proto", incomingUrl.protocol.slice(0, -1));

      const proxyRequest = new Request(backendUrl, {
        method: request.method,
        headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "manual"
      });

      return fetch(proxyRequest);
    }

    // Everything else is served by the existing Vite build.
    return env.ASSETS.fetch(request);
  }
};
