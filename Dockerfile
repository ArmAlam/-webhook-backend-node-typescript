FROM node:14-slim

# Run everything after as non-privileged user.
#USER pptruser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 9000

CMD [ "node", "build/index.js" ]
