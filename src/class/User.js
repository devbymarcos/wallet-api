class User {
    constructor(user) {
        this.id = user.id || null;
        this.first_name = user.first_name || null;
        this.last_name = user.last_name || null;
        this.email = user.email || null;
        this.password = user.password || null;
    }

    findById() {}

    findByEmail() {}

    register() {
        const existingUser = this.findByEmail();
    }
    update() {}
}
