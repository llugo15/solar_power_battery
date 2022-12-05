// User model used to model what the user should have
export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpiration: Date
    ) {}

    get token() {
        if (!this._tokenExpiration || new Date() > this._tokenExpiration) { return; }
        return this._token;
    }
}