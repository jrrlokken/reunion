FROM node:alpine/gallium
COPY ./var/www/reunion
WORKDIR /var/www/reunion
EXPOSE 3006

CMD ["npm", "install"]
LABEL version="0.1"
