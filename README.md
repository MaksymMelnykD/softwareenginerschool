Для запуску проекту потрібно:
git clone https://github.com/MaksymMelnykD/softwareenginerschool
npm install
docker build . -t <ваша назва>
docker run -p 80:8080 <ваша назва>