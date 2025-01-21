# How to Run

## 1. Buka 2 terminal
## 2. Terminal 1 (Backend)
```html
cd agricultural-supply-chain/backend
npm init -y
npm install express cors body-parser uuid
npm start
```
## 3. Terminal 2 (Frontend)
```html
cd ../frontend
npx create-react-app .
npm install axios
npm start
```
## 4. Akses Backend
```html
http://localhost:5000
http://localhost:5000/debug/farmers
http://localhost:5000/debug/products
```
## 5. Akses Frontend
```html
http://localhost:3000
```
