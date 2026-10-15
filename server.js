const http = require('node:http');

const port = Number(process.env.PORT) || 3000;
let nextItemId = 3;
const items = [
  { id: 1, name: 'Notebook' },
  { id: 2, name: 'Pencil' },
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) {
      throw new Error('Request body is too large');
    }
  }
  return JSON.parse(body);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const path = url.pathname;

  if (request.method === 'GET' && path === '/api/health') {
    return sendJson(response, 200, { status: 'ok', service: 'testing-pract-7-api' });
  }

  if (request.method === 'GET' && path === '/api/items') {
    return sendJson(response, 200, items);
  }

  if (request.method === 'POST' && path === '/api/items') {
    try {
      const body = await readJson(request);
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return sendJson(response, 400, { error: 'name must be a non-empty string' });
      }

      const item = { id: nextItemId++, name: body.name.trim() };
      items.push(item);
      return sendJson(response, 201, item);
    } catch (error) {
      const statusCode = error.message === 'Request body is too large' ? 413 : 400;
      return sendJson(response, statusCode, { error: statusCode === 413 ? error.message : 'Invalid JSON body' });
    }
  }

  const itemMatch = path.match(/^\/api\/items\/(\d+)$/);
  if (request.method === 'GET' && itemMatch) {
    const item = items.find((entry) => entry.id === Number(itemMatch[1]));
    return item
      ? sendJson(response, 200, item)
      : sendJson(response, 404, { error: 'Item not found' });
  }

  return sendJson(response, 404, { error: 'Route not found' });
});

server.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});