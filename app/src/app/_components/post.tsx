"use client"
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { api } from "~/trpc/react";
import { useFetchData } from "../hooks";
import { Post } from "@prisma/client";
import { useSession, signIn } from "next-auth/react";

export type propTypes = {
    props: {
        noPostsText: string;
        recentPostText: string;
        inputPlaceholder: string;
        submitButtonText: string;
        submittingText: string;
        inputClassName: string;
        buttonClassName: string;
        latestPost: Post;
        numPosts: number;
    };
};

export function LatestPost(props: propTypes) {
    // const [numPosts, setNumPosts] = useState()
    const {
        noPostsText,
        recentPostText,
        inputPlaceholder,
        submitButtonText,
        submittingText,
        inputClassName,
        buttonClassName,
        latestPost,
        numPosts
    } = props.props;

    // const { data: session } = useSession();

    // const URL = "http://127.0.0.1:5000/user/"+session?.user.id+"/post_count"

    // useEffect(() => {
    //     fetch(URL)
    //     .then(res => {
    //         console.log(res)
    //         setNumPosts(res.body)
    //     })
    // }, [])

    const utils = api.useUtils();
    const [name, setName] = useState("");
    const createPost = api.post.create.useMutation({
        onSuccess: async () => {
            await utils.post.invalidate();
            setName("");
        },
    });

    return (
        <div className="w-full max-w-xs">
            {latestPost ? (
                <p className="truncate">
                    {`${recentPostText} ${latestPost.name}`}
                    <br/>
                    Number of posts: {numPosts}
                </p>
            ) : (
                <p>{noPostsText}</p>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createPost.mutate({ name });
                }}
                className="flex flex-col gap-2"
            >
                <input
                    type="text"
                    placeholder={inputPlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-full px-4 py-2 ${inputClassName}`}
                />
                <button
                    type="submit"
                    className={`rounded-full px-10 py-3 font-semibold transition ${buttonClassName}`}
                    disabled={createPost.isPending}
                >
                    {createPost.isPending ? submittingText : submitButtonText}
                </button>
            </form>
        </div>
    );
}

