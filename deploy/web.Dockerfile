FROM nginx

COPY web /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
