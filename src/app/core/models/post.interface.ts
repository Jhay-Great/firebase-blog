export interface IPost {
    body: string;
    title: string;
    comments: IComment[]
    userId: string;
    updatedAt?: string;
    createdAt?: string;
}

export interface IComment {
    userId: string;
    postId: string;
    id: string;
    body: string;
}