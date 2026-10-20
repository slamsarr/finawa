FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist/finawa/browser /usr/share/nginx/html

EXPOSE 80