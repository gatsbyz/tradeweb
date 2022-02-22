import { ORDER_SIDE_TYPE } from "@/models/order";

export interface TopOfTheOrder {
  highestBuy?: number,
  lowestSell?: number
}
interface BookTable {
  [ticker: string]: TopOfTheOrder
}

export class Book {

  book: BookTable;

  constructor() {
    this.book = {}
  }

  updateBook(ticker: string, side: ORDER_SIDE_TYPE, price: number | undefined) {
    this.checkBook(ticker);
    if (!price) {
      return;
    }
    const topOfTheBook = this.getTopOfTheBook(ticker)[side === 'buy' ? 'highestBuy' : 'lowestSell'];
    if (!topOfTheBook
      || side === ORDER_SIDE_TYPE.BUY && price > topOfTheBook
      || side === ORDER_SIDE_TYPE.SELL && price < topOfTheBook) {
      this.book[ticker][side === 'buy' ? 'highestBuy' : 'lowestSell'] = price;
    }
  }

  getTopOfTheBook(ticker: string): TopOfTheOrder {
    return this.book[ticker];
  }

  getAllSymbols(): string[] {
    return Object.keys(this.book);
  }

  private checkBook(ticker: string) {
    if (!this.book[ticker]) {
      this.book[ticker] = {};
    }
  }

}
