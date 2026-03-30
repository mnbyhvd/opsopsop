# Chromium already pre-installed — no apk/apt needed
FROM zenika/alpine-chrome:with-node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY prerender.js ./

CMD ["node", "prerender.js"]
