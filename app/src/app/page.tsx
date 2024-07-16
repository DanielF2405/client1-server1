import { Post } from "@prisma/client";
import Link from "next/link";
import { useFetchData } from "./hooks";

import { LatestPost, propTypes } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const testData = {
  props: {
    latestPost: {
      id: 1,
      name: "First Post",
      createdAt: new Date("2024-01-01T12:00:00Z"),
      updatedAt: new Date("2024-01-01T12:00:00Z"),
      createdById: "user-123",
    },
    numPosts: 10,
    noPostsText: "No posts available",
    recentPostText: "Check out our recent post:",
    inputPlaceholder: "Write your comment here...",
    submitButtonText: "Submit",
    submittingText: "Submitting...",
    inputClassName: "comment-input",
    buttonClassName: "submit-button",
  },
};

const LatestPostProps = {
  noPostsText: "You have no posts yet.",
  recentPostText: "Your most recent post:",
  inputPlaceholder: "Title",
  submitButtonText: "Submit",
  submittingText: "Submitting...",
  inputClassName: "text-black",
  buttonClassName: "bg-white/10 hover:bg-white/20",
};

type Props = {
  greetingText: string;
  mainBgGradient: string;
  titleText: string;
  titleHighlightColor: string;
  links: {
    href: string;
    title: string;
    description: string;
  }[];
  signInText: string;
  signOutText: string;
  loggedInText: string;
  linkBgColor: string;
  linkHoverBgColor: string;
  linkTextColor: string;
};

export default async function Home({
  greetingText,
  mainBgGradient,
  titleText,
  titleHighlightColor,
  links,
  signInText,
  signOutText,
  loggedInText,
  linkBgColor,
  linkHoverBgColor,
  linkTextColor,
}: Props) {
  const fetchFunction = async () => {
    const latestPost = (await api.post.getLatest()) as Post;

    const URL =
      "http://127.0.0.1:5000/user/" + session?.user.id + "/post_count";

    const count = await (await fetch(URL)).json();

    return {
      props: {
        ...LatestPostProps,
        latestPost,
        numPosts: count.post_count,
      },
    };
  };
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  const wrap = async () => {
    if (session?.user) {
      return await fetchFunction();
    }
  };

  const props = await useFetchData({
    fetchFunction: wrap,
    isTestMode: true,
    testData,
  });

  return (
    <HydrateClient>
      <main
        className={`flex min-h-screen flex-col items-center justify-center ${mainBgGradient} ${linkTextColor}`}
      >
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {titleText}{" "}
            <span className={`text-[${titleHighlightColor}]`}>T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {links.map((link, index) => (
              <Link
                key={index}
                className={`flex max-w-xs flex-col gap-4 rounded-xl ${linkBgColor} p-4 hover:${linkHoverBgColor}`}
                href={link.href}
                target="_blank"
              >
                <h3 className="text-2xl font-bold">{link.title} →</h3>
                <div className="text-lg">{link.description}</div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl">{hello ? hello.greeting : greetingText}</p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl">
                {session && (
                  <span>
                    {loggedInText} {session.user?.name}
                  </span>
                )}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className={`rounded-full ${linkBgColor} px-10 py-3 font-semibold no-underline transition hover:${linkHoverBgColor}`}
              >
                {session ? signOutText : signInText}
              </Link>
            </div>
          </div>

          {session?.user && props && (
            <LatestPost props={props.props} />
            // <></>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}

Home.defaultProps = {
  greetingText: "Loading tRPC query...",
  mainBgGradient: "bg-gradient-to-b from-[#2e026d] to-[#15162c]",
  titleText: "Create",
  titleHighlightColor: "hsl(280,100%,70%)",
  signInText: "Sign in",
  signOutText: "Sign out",
  loggedInText: "Logged in as",
  linkBgColor: "bg-white/10",
  linkHoverBgColor: "hover:bg-white/20",
  linkTextColor: "text-white",
  links: [
    {
      href: "https://create.t3.gg/en/usage/first-steps",
      title: "First Steps",
      description:
        "Just the basics - Everything you need to know to set up your database and authentication.",
    },
    {
      href: "https://create.t3.gg/en/introduction",
      title: "Documentation",
      description:
        "Learn more about Create T3 App, the libraries it uses, and how to deploy it.",
    },
  ],
};
