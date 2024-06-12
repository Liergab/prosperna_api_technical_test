# FOLDER STRACTURE
- index.js -    entry point.
- routes -     where the endpoint located.
- controller - Where the return of logic located / maintain cleanliness of controller.
- services -  Where the logic made.
- model -     mongdb/mongoose fields and collection.
- middleware - Where the validation in error and authenticated, AdminAuth, located 
- config  - Where database, other like bcrypt etc.
- utils - HttpError and GenerateToken By Json Webtoken.

### Admin mock email and password 
- Admin123@gmail.com
- admin12345
### TO RUN PROSPERNA API
- npm run dev 
- Register / login - automatic there is JWT token in cookies /HttpOnly cookie no need to put authorization Bearer ${token.}

### ENV VARIABLES

- MONGODB_URL_STRING = "mongodb+srv://admin:admin@cluster0.yyzsosg.mongodb.net/prosperna_api_test_db?retryWrites=true&w=majority&appName=Cluster0"
- PORT = 5001
- JWT_SECRET_KEY= "$2a$10$4D.fx7J/7D1BFLBH8QgxZeVMhN609V56LRUM/lb9YIdbz6GA8VA3O"

### Unit Test 
- npm run test

 