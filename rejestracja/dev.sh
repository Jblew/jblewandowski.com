docker build -t rejestracja .
docker run -it -p 80:80 --env-file=.env.local rejestracja
