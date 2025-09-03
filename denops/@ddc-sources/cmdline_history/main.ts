import type {
  Context,
  DdcOptions,
  Item,
  SourceOptions,
} from "@shougo/ddc-vim/types";
import { BaseSource } from "@shougo/ddc-vim/source";

import type { Denops } from "@denops/std";

type Params = {
  limit: number;
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
    const histories = await args.denops.call(
      "ddc_cmdline_history#get",
      args.sourceParams.limit,
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
      limit: 1000,
    };
  }
}
