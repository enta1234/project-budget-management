#!/bin/sh

# Provide menu options to start containers
cat <<MENU
Choose an option:
1) Start all services
2) Start databases only (MongoDB and Redis)
3) Start service and databases
MENU

printf "Enter choice [1-3]: "
read choice

case "$choice" in
  1)
    docker-compose up --build
    ;;
  2)
    docker-compose up --build mongo redis
    ;;
  3)
    docker-compose up --build mongo redis service
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
