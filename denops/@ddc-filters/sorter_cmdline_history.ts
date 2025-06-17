import { type Item } from "jsr:@shougo/ddc-vim@~9.5.0/types";
import { BaseFilter } from "jsr:@shougo/ddc-vim@~9.5.0/filter";

import type { Denops } from "jsr:@denops/core@~7.0.0";

import { assertEquals } from "jsr:@std/assert@~1.0.3/equals";

type Params = {
  limit: number;
};

function calcScore(
  defaultScore: number,
  str: string,
  histories: string[],
): number {
  let score = defaultScore;

  for (let i = 0; i < histories.length; i++) {
    const history = histories[i];
    if (history.includes(str)) {
      score = i;
      break;
    }
  }

  return score;
}

export class Filter extends BaseFilter<Params> {
  override async filter(args: {
    denops: Denops;
    filterParams: Params;
    items: Item[];
  }): Promise<Item[]> {
    const histories = await args.denops.call(
      "ddc_cmdline_history#get",
      args.filterParams.limit,
    ) as string[];

    return Promise.resolve(args.items.sort((a, b) => {
      return calcScore(args.filterParams.limit, a.word, histories) -
        calcScore(args.filterParams.limit, b.word, histories);
    }));
  }

  override params(): Params {
    return {
      limit: 500,
    };
  }
}

Deno.test("calcScore returns defaultScore if no match", () => {
  assertEquals(calcScore(100, "foo", ["bar", "baz", "qux"]), 100);
});

Deno.test("calcScore returns index of first match", () => {
  assertEquals(calcScore(100, "ba", ["foo", "bar", "baz"]), 1);
  assertEquals(calcScore(100, "z", ["foo", "bar", "baz"]), 2);
  assertEquals(calcScore(0, "foo", ["foo", "foofoo"]), 0);
});

Deno.test("calcScore returns first match index even if multiple matches", () => {
  assertEquals(calcScore(9, "o", ["foo", "boo", "baz"]), 0);
});
