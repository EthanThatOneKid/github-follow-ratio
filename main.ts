import { MINUTE } from "@std/datetime";
import { createRouter } from "@fartlabs/rt";
import type { FollowRatio } from "./github.ts";
import { getFollowRatio } from "./github.ts";

const kv = await Deno.openKv();

const router = createRouter()
  .get<"username">("/api/:username", async (event) => {
    const { username } = event.params;
    if (!username) {
      return new Response("Missing username", { status: 400 });
    }

    const followRatioKey: Deno.KvKey = ["followRatio", username];
    const followRatioResult = await kv.get<FollowRatio>(followRatioKey);
    if (followRatioResult?.value) {
      return Response.json(followRatioResult.value);
    }

    const followRatio = await getFollowRatio(username);
    await kv.set(
      followRatioKey,
      followRatio,
      { expireIn: 5 * MINUTE },
    );
    return Response.json(followRatio);
  });

Deno.serve((request) => router.fetch(request));
