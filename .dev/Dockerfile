FROM node:latest

ENV NODE_ENV=development

WORKDIR /var/app

RUN yarn global add nodemon

CMD ["nodemon", "--debug=56745", "app/start.js"]
