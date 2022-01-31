FROM node

RUN apt install git

WORKDIR /src
RUN git clone --depth=1 https://github.com/david-alexander/httptoolkit-ui/

RUN npm config set ignore-scripts true

WORKDIR /src/httptoolkit-ui
RUN npm i
ENV NODE_OPTIONS --openssl-legacy-provider
RUN npx env-cmd -f ./automation/ts-node.env node --max_old_space_size=4096 node_modules/.bin/webpack --config ./automation/webpack.dev.ts

ENTRYPOINT [ "npm", "run", "start:docker" ]
