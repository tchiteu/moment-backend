FROM node:13.12
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update \
  && apt-get install -y mysql-server mysql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

CMD service mysql start && service mysql status

COPY ./ /
RUN npm install --no-optional && npm cache clean --force
RUN npx knex migrate:latest

ENTRYPOINT ["npm", "start"]