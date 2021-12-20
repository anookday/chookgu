# NGINX base
FROM nginx:1.21-alpine

# remove any existing config files
RUN rm /etc/nginx/conf.d/*

# copy config files
COPY default.conf /etc/nginx/conf.d/

# expose the listening port
EXPOSE 80

# launch NGINX
CMD ["nginx", "-g", "daemon off;"]
