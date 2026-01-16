FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "./index.js"]

# CMD ["node", "./index.js"]
# docker build . -t api-express-docker
# docker build -t ejemplo-api:v1.0.0 ./
# docker run -p 4000:3000 api-express-docker
# docker build -t cristiancmon/ejemplo-api:v1.0.0 ./

# docker run -p 3000:3000 -e PORT=3000 -e USER=cristian -e MONGO_URI=mongo ejemplo-api 


# https://www.geeksforgeeks.org/mongodb/how-to-set-username-and-password-in-mongodb-compass/
# Necesario crear usuario en db, p.e. root/root
# use admin
# db.createUser({user: "root", pwd: passwordPrompt(), roles: ["root"]})


# Build: docker build -t dccp/ejemplo-api:v1.0.0 ./ nombreUsuario, nombreImagen, tag, ruta
# Push: docker push dccp/ejemplo-api:v1.0.0 nombreUsuario, nombreImagen, tag.