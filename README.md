Перед запуском у файлі index.js у полях user та pass (12 та 13 строки) вписати свої данні gmail. У user - адресу пошти, у pass - пароль, у місце між ""
Для запуску проекту потрібно:
```git clone https://github.com/MaksymMelnykD/softwareenginerschool```
```npm install```
```docker build . -t <ваша назва>```
```docker run -p 80:8080 <ваша назва>```
При запуску з таким самим флагом <-p> для просмотру проекту треба перейти у браузері на http://localhost:80/