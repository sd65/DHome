FROM resin/raspberrypi3-buildpack-deps:jessie

# Install Nginx

RUN apt update \
  && apt upgrade \
  && apt install nginx

COPY nginx.conf /etc/nginx

EXPOSE 8080 8081

VOLUME /srv

RUN addgroup --system nginx \
  && adduser --system nginx

RUN touch /var/run/nginx.pid \
  && chown -R nginx: /var/run/nginx.pid \
  && chown -R nginx: /var/lib/nginx \
  && chown -R nginx: /var/log/nginx

USER nginx

CMD [ "nginx" ]
