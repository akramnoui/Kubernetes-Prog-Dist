FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-slim
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build /app/build
EXPOSE 4000
CMD ["serve", "-s", "build", "-l", "4000"]
