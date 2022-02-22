import autoBind from "auto-bind";

import { Book as BookService, TopOfTheOrder } from "@/services/book";

interface ServicesInterface {
  book: BookService;
}

export class Book {
  private readonly services: ServicesInterface;

  constructor(services: ServicesInterface, config?, doAutoBind = true) {
    this.services = services;

    if (doAutoBind) {
      autoBind(this);
    }
  }

  getSymbols(): string[] {
    return this.services.book.getAllSymbols();
  }

  getTopOfTheBook(request): TopOfTheOrder {
    const { ticker }: { ticker: string } = request.query;
    return this.services.book.getTopOfTheBook(ticker);
  }
}
