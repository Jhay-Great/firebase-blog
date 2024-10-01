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
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface IUserResponseData {
    username: string;
    email: string;
    creationTime: number;
    createAt?: string;
    lastSignInTime?: string;
    

}

// export interface ISignOut {
//     signOut() :void
// }