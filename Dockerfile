FROM debian:stretch

RUN apt-get update \
    && apt-get install -y curl

RUN mkdir -p /recipes

WORKDIR /recipes

RUN curl -sSL https://get.haskellstack.org/ | sh

RUN stack setup

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs

COPY . /recipes

RUN npm install

RUN stack build

RUN make build
