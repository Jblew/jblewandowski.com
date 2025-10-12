FROM node:22-alpine
WORKDIR /app

ADD backend/package*.json /app/backend/
RUN sh -c "cd backend && npm ci"

ADD frontend/package*.json /app/frontend/
RUN sh -c "cd frontend && npm ci"

ADD backend /app/backend/
RUN sh -c "cd /app/backend && ls && npm run build"

ADD frontend /app/frontend/
RUN sh -c "cd /app/frontend && ls && npm run build"

ENV STATIC_ASSETS_PATH=/app/public
ADD public /app/public/
RUN mv /app/frontend/dist /app/public/frontend

ADD auth0.json /app/auth0.json

ENV PORT=80
EXPOSE 80
CMD ["node", "/app/backend/dist/index.js"]
