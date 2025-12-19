
this api will show json file of cards and via using express.js 



commands:

run server: node index.js

login:
curl -X POST http://localhost:3000/getToken \
-H "Content-Type: application/json" \
-d '{"username":"username require ","password":"password require"}'

add:
curl -X POST http://localhost:3000/cards/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "cardId": "card1",
  "name": "Fire Dragon",
  "power": 9000
}'

edit:
curl -X PUT http://localhost:3000/cards/card1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"power":9500}'


delete:
curl -X DELETE http://localhost:3000/cards/card1 \
-H "Authorization: Bearer YOUR_TOKEN"



sets:
curl http://localhost:3000/sets


Type:

curl http://localhost:3000/types


Rarity:
curl http://localhost:3000/rarities

Count:
curl http://localhost:3000/cards/count


Random:
curl http://localhost:3000/cards/random



