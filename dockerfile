FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY backend ./backend
COPY frontend ./frontend

RUN cd frontend && npm run build

EXPOSE 5000

CMD ["node", "backend/server.js"]
