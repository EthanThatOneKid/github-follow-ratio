/**
 * The Follow Ratio is simply the number of followers someone has divided by the number of people following them. A value above 1 means an account has more followers than accounts they are following.
 */
export interface FollowRatio extends FollowerFollowingCount {
  ratio: number;
  difference: number;
  notFollowingBack?: string[];
  notFollowedBack?: string[];
  followingEachOther?: string[];
}

export async function getRatio(
  username: string,
  maxFollowers = 500,
  maxFollowing = 500,
): Promise<FollowRatio> {
  const { followers, following } = await getFollowerFollowingCount(username);
  const difference = followers - following;
  const ratio = parseFloat((followers / Math.max(following, 1)).toPrecision(4));
  if (followers > maxFollowers || following > maxFollowing) {
    return { followers, following, ratio, difference };
  }

  const followersList = await getFollowers(username);
  const followingList = await getFollowing(username);
  const notFollowingBack = followersList.filter(
    (follower) => !followingList.includes(follower),
  );
  const notFollowedBack = followingList.filter(
    (following) => !followersList.includes(following),
  );
  const followingEachOther = followersList.filter((follower) =>
    followingList.includes(follower)
  );

  return {
    difference,
    ratio,
    followers,
    following,
    notFollowingBack,
    notFollowedBack,
    followingEachOther,
  };
}

export interface FollowerFollowingCount {
  followers: number;
  following: number;
}

export async function getFollowerFollowingCount(
  username: string,
): Promise<FollowerFollowingCount> {
  const user = await fetch(`https://api.github.com/users/${username}`);
  if (!user.ok) {
    throw new Error(`Failed to fetch user: ${user.statusText}`);
  }

  const { followers, following } =
    (await user.json()) as FollowerFollowingCount;
  return { followers, following };
}

export async function getFollowers(username: string): Promise<string[]> {
  const allFollowers: string[] = [];
  let nextPageURL:
    | string
    | null = `https://api.github.com/users/${username}/followers`;

  while (nextPageURL) {
    const response: Response = await fetch(nextPageURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch followers: ${response.statusText}`);
    }

    const followers = (await response.json()) as { login: string }[];
    allFollowers.push(...followers.map((follower) => follower.login));

    const linkHeader = response.headers.get("Link");
    nextPageURL = linkHeader?.match(/\<([^>]+)\>; rel="next"/)?.[1] || null;
  }

  return allFollowers;
}

export async function getFollowing(username: string): Promise<string[]> {
  const allFollowing: string[] = [];
  let nextPageURL:
    | string
    | null = `https://api.github.com/users/${username}/following`;

  while (nextPageURL) {
    const response: Response = await fetch(nextPageURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch following: ${response.statusText}`);
    }

    const following = (await response.json()) as { login: string }[];
    allFollowing.push(...following.map((follower) => follower.login));

    const linkHeader = response.headers.get("Link");
    nextPageURL = linkHeader?.match(/\<([^>]+)\>; rel="next"/)?.[1] || null;
  }

  return allFollowing;
}
