export interface IPost {
    id: string;
    body: string;
    title: string;
    comments?: IComment[]
    userId: string;
    updatedAt?: string;
    createdAt?: string;
}

export interface IComment {
    userId: string;
    postId: string;
    id: string;
    comment: string;
}

export interface IPostWithComments {
    
body: string;
comments: IComment[];
id: string;
title: string;
userId: string;
}