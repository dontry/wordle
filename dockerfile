# pull official base image
FROM node:14-alpine as build
# Add a work directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package*.json  /app/
RUN yarn install
# Copy app files
COPY . /app/
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html
# Add your nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
