FROM node:18
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Build and run the app
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
