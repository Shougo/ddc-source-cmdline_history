import {
  type Context,
  type DdcOptions,
  type Item,
  type SourceOptions,
} from "jsr:@shougo/ddc-vim@~7.0.0/types";
import { BaseSource } from "jsr:@shougo/ddc-vim@~7.0.0/source";

import type { Denops } from "jsr:@denops/core@~7.0.0";

type Params = {
  maxSize: number;
};

export class Source extends BaseSource<Params> {
  override async gather(args: {
    denops: Denops;
    context: Context;
    options: DdcOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    completeStr: string;
  }): Promise<Item[]> {
    const maxSize = args.sourceParams.maxSize;
    const histories = await args.denops.call(
      "ddc_cmdline_history#get",
      maxSize,
    ) as string[];

    if (args.context.input.indexOf(" ") < 0) {
      return histories.map((word) => ({ word }));
    }

    const inputLength = args.context.input.length - args.completeStr.length;
    const input = inputLength > 0
      ? args.context.input.substring(0, inputLength)
      : args.context.input;
    return histories.filter(
      (word) =>
        word.startsWith(input) && word.indexOf("\r") < 0 &&
        word.indexOf("\n") < 0,
    ).map((word) => ({ word: word.substring(inputLength) }));
  }

  override params(): Params {
    return {
      maxSize: 1000,
    };
  }
}
