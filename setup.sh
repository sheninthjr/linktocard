cp .env.example .env

docker run -d --name linktopost \
    -e DATABASE_URL=postgres://postgres:sheninthjr@localhost:5432/postgres \
    -p 3000:3000 