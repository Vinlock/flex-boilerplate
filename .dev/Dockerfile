FROM node:latest

ENV NODE_ENV=development

WORKDIR /var/app

RUN yarn global add nodemon

CMD ["nodemon", "--inspect=56745", "--legacy-watch", "scripts/start_dev.js"]
