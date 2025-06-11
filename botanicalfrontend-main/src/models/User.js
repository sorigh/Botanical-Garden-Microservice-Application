export class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.roles = data.roles || new Set(); // roles can be an array or a Set of Role objects/strings
    }
}