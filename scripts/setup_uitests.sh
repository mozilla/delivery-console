# Setup database for uitests
set -x

git clone --depth 1 https://github.com/mozilla/normandy.git ~/normandy
docker-compose -f ~/normandy/ci/docker-compose.yml up -d --build
docker-compose -f ~/normandy/ci/docker-compose.yml ps
sleep 10
docker-compose -f ~/normandy/ci/docker-compose.yml up -d
docker-compose -f ~/normandy/ci/docker-compose.yml exec web python manage.py migrate
docker-compose -f ~/normandy/ci/docker-compose.yml exec web python manage.py update_product_details
docker-compose -f ~/normandy/ci/docker-compose.yml exec web python manage.py initial_data
docker-compose -f ~/normandy/ci/docker-compose.yml exec web python manage.py createsuperuser --noinput --username user --email user@example.com
