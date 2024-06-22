import { MINUTE } from "@std/datetime";
import type { FollowRatio } from "./github.ts";
import { getFollowRatio } from "./github.ts";

const kv = await Deno.openKv();

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const ratioKey: Deno.KvKey = ["followRatio", username];
  const ratioResult = await kv.get<FollowRatio>(ratioKey);
  if (ratioResult?.value) {
    return Response.json(ratioResult.value);
  }

  const ratio = await getFollowRatio(username);
  await kv.set(
    ratioKey,
    ratio,
    { expireIn: 5 * MINUTE },
  );
  return Response.json(ratio);
});
