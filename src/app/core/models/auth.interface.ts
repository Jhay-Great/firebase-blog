export interface ILogin {
    login(data:{email:string, password:string}) :any
}

export interface ILogOut {
    logout() :void
}

export interface ISignIn {
    signup(data:any) :void
}

export interface IUserData {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface IUserResponseData {
    // id:string;
    username: string;
    email: string;
    creationTime: number;
    createAt?: string;
    lastSignInTime?: string;
    

}

// export interface ISignOut {
//     signOut() :void
// }