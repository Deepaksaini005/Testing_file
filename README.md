# Selenium_testing-

Create a Node.js app with at least three APIs. This project provides a small JSON API built with Node.js and no external dependencies. Items are kept in memory and reset when the server restarts.

## Run

```sh
npm start
```

The server listens on `http://localhost:3000`. Set the `PORT` environment variable to use another port.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running; returns its service name |
| `GET` | `/api/items` | List all items |
| `POST` | `/api/items` | Create an item with a JSON `name` |
| `GET` | `/api/items/:id` | Get one item by ID |

Example request:

```sh
curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"name\":\"Marker\"}"
```