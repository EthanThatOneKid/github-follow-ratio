import { createRouter } from "@fartlabs/rt";
import {
  A,
  BODY,
  BUTTON,
  DIV,
  FOOTER,
  FORM,
  H1,
  HEAD,
  HTML,
  INPUT,
  LI,
  LINK,
  MAIN,
  META,
  P,
  SCRIPT,
  SECTION,
  SPAN,
  STRONG,
  TITLE,
  UL,
} from "@fartlabs/htx";
import type { FollowRatio } from "./github.ts";
import { getFollowRatio } from "./github.ts";

if (import.meta.main) {
  const cache = await caches.open("github-follow-ratio");
  const router = createRouter()
    .get("/", async (event) => {
      const cached = await cache.match(event.request);
      if (cached) {
        return cached;
      }

      return await renderPage(
        event.url.searchParams.get("username") ?? undefined,
      );
    });

  Deno.serve((request) => router.fetch(request));
}

async function renderPage(username?: string): Promise<Response> {
  const followRatio = username ? await getFollowRatio(username) : undefined;

  return new Response(
    <Layout username={username} followRatio={followRatio}>
      <UsernameInputView username={username} />
      {username && followRatio
        ? (
          <FollowRatioView
            username={username}
            followRatio={followRatio}
          />
        )
        : ""}
    </Layout>,
    { headers: { "Content-Type": "text/html" } },
  );
}

interface LayoutProps {
  children?: string[];
  username?: string;
  followRatio?: FollowRatio;
}

function Layout({ children, username, followRatio }: LayoutProps) {
  return "<!DOCTYPE html>" + (
    <HTML>
      <HEAD>
        <META charset="UTF-8" />
        <TITLE>
          {username ? `@${username} | ` : ""}GitHub Follower to Following Ratio
          Calculator
        </TITLE>
        <META
          name="description"
          content={followRatio
            ? `Ratio: ${followRatio.ratio}, Followers: ${followRatio.followers}, Following: ${followRatio.following}, Difference: ${followRatio.difference}`
            : "Want to know your GitHub follower to following ratio?"}
        />

        <LINK
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/EthanThatOneKid/thelcars/assets/lcars-ultra-classic.css"
        />
        <LINK
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/EthanThatOneKid/thelcars/assets/lcars-colors.css"
        />
        <SCRIPT
          src="https://cdn.jsdelivr.net/gh/EthanThatOneKid/thelcars/assets/lcars.js"
          defer="true"
        >
        </SCRIPT>
        <SCRIPT src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js">
        </SCRIPT>
      </HEAD>
      <BODY>
        <SECTION id="column-3">
          <DIV class="wrap" id="gap">
            <DIV class="left-frame">
              <DIV class="scroll-top">
                <A id="scroll-top" href="">
                  <SPAN class="hop">screen</SPAN> top
                </A>
              </DIV>
              <DIV>
                <DIV class="panel-3">
                  03<SPAN class="hop">-111968</SPAN>
                </DIV>
                <DIV class="panel-4">
                  04<SPAN class="hop">-041969</SPAN>
                </DIV>
                <DIV class="panel-5">
                  05<SPAN class="hop">-1701D</SPAN>
                </DIV>
                <DIV class="panel-6">
                  06<SPAN class="hop">-071984</SPAN>
                </DIV>
                <DIV class="panel-7">
                  07<SPAN class="hop">-081940</SPAN>
                </DIV>
                <DIV class="panel-8">
                  08<SPAN class="hop">-47148</SPAN>
                </DIV>
                <DIV class="panel-9">
                  09<SPAN class="hop">-081966</SPAN>
                </DIV>
              </DIV>
              <DIV>
                <DIV class="panel-10">
                  10<SPAN class="hop">-31</SPAN>
                </DIV>
              </DIV>
            </DIV>
            <DIV class="right-frame">
              <DIV class="bar-panel">
                <DIV class="bar-6"></DIV>
                <DIV class="bar-7"></DIV>
                <DIV class="bar-8"></DIV>
                <DIV class="bar-9"></DIV>
                <DIV class="bar-10"></DIV>
              </DIV>
              <MAIN>
                {children?.join("")}

                <FOOTER>
                  <DIV class="footer-inside">
                    <DIV class="footer-text">
                      <P>
                        Programmed with <SPAN class="hop">❤</SPAN>{" "}
                        <STRONG>
                          <GitHubProfileLink username="FartLabs" />
                        </STRONG>
                      </P>
                      <P>
                        LCARS Inspired Website Template by{" "}
                        <A href="https://www.thelcars.com">
                          www.TheLCARS.com
                        </A>
                      </P>
                    </DIV>
                  </DIV>
                  <DIV class="footer-panel">
                    <SPAN class="hop">22</SPAN>47
                  </DIV>
                </FOOTER>
              </MAIN>
            </DIV>
          </DIV>
        </SECTION>
      </BODY>
    </HTML>
  );
}

function UsernameInputView({ username }: { username?: string }) {
  return (
    <DIV>
      <H1 class="go-left">
        GitHub Follower to Following Ratio Calculator
      </H1>
      <DIV class="lcars-text-bar">
        <SPAN>Enter GitHub username</SPAN>
      </DIV>
      <FORM action="" method="GET">
        <INPUT
          type="search"
          name="username"
          placeholder="Username"
          value={username}
        />
        <BUTTON type="submit">Calculate</BUTTON>
      </FORM>
    </DIV>
  );
}

interface FollowRatioViewProps {
  username: string;
  followRatio: FollowRatio;
}

function FollowRatioView(props: FollowRatioViewProps) {
  return (
    <DIV>
      <DIV class="lcars-text-bar">
        <SPAN>
          <GitHubProfileLink username={props.username} />
        </SPAN>
      </DIV>

      <DIV class="lcars-list-2 uppercase">
        <UL>
          <LI>Ratio: {props.followRatio.ratio}</LI>
          <LI>Followers: {props.followRatio.followers}</LI>
          <LI>Following: {props.followRatio.following}</LI>
          <LI>Difference: {props.followRatio.difference}</LI>
        </UL>
      </DIV>

      <DIV class="lcars-text-bar">
        <SPAN>
          Not following <GitHubProfileLink username={props.username} />{" "}
          back ({props.followRatio.notFollowedBack?.length})
        </SPAN>
      </DIV>
      <P>
        {props.followRatio.notFollowedBack?.map((username) => (
          <GitHubProfileLink username={username} />
        )).join(", ")}
      </P>

      <DIV class="lcars-text-bar">
        <SPAN>
          Not followed back by <GitHubProfileLink username={props.username} />
          {" "}
          ({props.followRatio.notFollowingBack?.length})
        </SPAN>
      </DIV>
      <P>
        {props.followRatio.notFollowingBack?.map((username) => (
          <GitHubProfileLink username={username} />
        )).join(", ")}
      </P>

      <DIV class="lcars-text-bar">
        <SPAN>
          Following each other ({props.followRatio.followingEachOther?.length})
        </SPAN>
      </DIV>
      <P>
        {props.followRatio.followingEachOther?.map((username) => (
          <GitHubProfileLink username={username} />
        )).join(", ")}
      </P>
    </DIV>
  );
}

interface GitHubProfileLinkProps {
  username: string;
}

function GitHubProfileLink({ username }: GitHubProfileLinkProps) {
  return <A href={`https://github.com/${username}`}>@{username}</A>;
}
