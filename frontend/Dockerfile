FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build --prod
EXPOSE 4200
CMD ["npx", "http-server", "dist/frontend", "-p", "4200"]
