FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies  
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend for production
RUN cd frontend && npm run build

# Install serve to host frontend
RUN npm install -g serve

EXPOSE 3000 5000

# Start both backend and frontend
CMD sh -c "node backend/server.js & serve -s frontend/build -l 3000"
