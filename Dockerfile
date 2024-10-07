# Use the official Nginx image from Docker Hub
FROM nginx:alpine
LABEL org.opencontainers.image.description "This is a simple Nginx web server for my network tools website."
# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website files into the Nginx directory
COPY . /usr/share/nginx/html

# Expose port 80 to make it accessible
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
