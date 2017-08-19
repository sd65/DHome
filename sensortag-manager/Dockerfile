FROM resin/raspberrypi3-buildpack-deps:jessie

# Install Node.js

ENV NODE_VERSION 8.4.0
ENV NODE_HASH a7e79224d98b0f419bd3af0b751f3e369b12a9fb4405b970fc31e552233ae768
ENV NODE_ARCHIVE_NAME node-v$NODE_VERSION-linux-armv7l.tar.xz
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/$NODE_ARCHIVE_NAME" \
  && echo "$NODE_HASH $NODE_ARCHIVE_NAME" | sha256sum -c - \
  && tar xf "$NODE_ARCHIVE_NAME" -C /usr/local --strip-components=1 \
  && rm "$NODE_ARCHIVE_NAME" \
  && npm config set unsafe-perm true -g --unsafe-perm \
  && rm -rf /tmp/*

COPY app /srv

WORKDIR /srv

RUN npm install --production

ENV NODE_ENV production

EXPOSE 9000

CMD [ "npm", "start" ]
