declare module "@techhof-ab/currency-converter" {
  function convert(
    amount: number,
    currencyFrom: string,
    currencyTo: string,
    date?: string
  ): Promise<unknown>;
  export = convert;
}

declare module "discord.js-pagination";
declare module "node-geocoder";
declare module "shoe-size-converter";
