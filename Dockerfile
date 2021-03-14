FROM alpine:3.11 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm

WORKDIR /backup
COPY package-lock.json ./package-lock.json
COPY package.json ./package.json
RUN npm ci
COPY . .

FROM alpine:3.11
RUN apk --no-cache add nodejs
WORKDIR /backup
RUN mkdir /backup/dist
COPY --from=builder /backup .

CMD ["node", "src/index"]
