
FROM python:3.7.4

WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
RUN yarn install


COPY . /app