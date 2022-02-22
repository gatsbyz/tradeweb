How to run

1. npm i 
2. npm start

Functions

1. A list of Symbols 
GET /book/symbols

2. Best bid (or buy order) / Best offer (or sell order)
GET /book/topOfTheBook?ticker={ticker}

3. An order entry form for creating and modify orders.
PUT /orders
request body {
   ticker: string
   trader: string
   side: 'buy' | 'sell'
   limitPrice: number
   quantity: number
}

5. A list of open, canceled, and completed orders and trades for the current trader (a blotter).
GET /trades/{traderId}
