#!/bin/sh

# Provide menu options to start containers
cat <<MENU
Choose an option:
1) Start all services
2) Start databases only (MongoDB and Redis)
3) Start service and databases
MENU

# Optional detached mode
DETACHED=""
if [ "$1" = "-d" ]; then
  DETACHED="-d"
  shift
fi

printf "Enter choice [1-3]: "
read choice

case "$choice" in
  1)
    docker-compose up --build $DETACHED
    ;;
  2)
    docker-compose up --build $DETACHED mongo redis
    ;;
  3)
    docker-compose up --build $DETACHED mongo redis service
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
