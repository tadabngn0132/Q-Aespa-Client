export const validateName = (name) => {
    const errors = [];

    if (!name) {
        errors.push("Name can not be empty!");
    } else if (name.trim() === '') {
        errors.push("Name can not contain only whitespace!");
    } else if (name.length < 2) {
        errors.push("Name must be at least 2 characters.");
    } else if (name.length > 50) {
        errors.push("Name can not exceed 50 characters.");
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        errors.push("Name can only contain letters, spaces, apostrophes, and hyphens.");
    } else if (/(.)\1{6,}/.test(name)) {
        errors.push("Name should not contain more than 6 repeated characters.");
    }

    return errors;
}

export const validateEmail = (email) => {
    const errors = [];

    if (!email) {
        errors.push("Email can not be empty!");
    } else if (email.trim() === '') {
        errors.push("Email can not contain only whitespace!");
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.push("Invalid email format.");
    } else if (email.includes('..')) {
        errors.push("Email can not contain consecutive dots.");
    } else if (email.startsWith('.') || email.endsWith('.')) {
        errors.push("Email can not start or end with a dot.");
    }
    
    // else if (!/\S+@\S+\.\S+/.test(email)) {
    //     errors.push("Invalid email format.");
    // }

    return errors;
};

export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        errors.push("Password can not be empty!");
    } else {  
        if(password.trim() === '') {
            errors.push("Password can not contain only whitespace!");
        }
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number [0-9].");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter [A-Z].");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter [a-z].");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push(`Password must contain at least one special character [!@#$%^&*(),.?":{}|<>].`);
        }
        if (/(.)\1{6,}/.test(password)) {
            errors.push("Password should not contain more than 6 repeated characters.");
        }

        const commonPasswords = ['password', 'admin123', '12345678', 'abcdefgh'];
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push("Please choose a stronger password. This is a commonly used password.");
        }
    } 

    return errors;
}

export const validateRegisterInput = (data) => {
    return {
        name: validateName(data.name),
        email: validateEmail(data.email),
        password: validatePassword(data.password)
    };
};

export const validateLoginInput = (data) => {
    return {
        email: validateEmail(data.email),
        password: !data.password ? ["Password can not be empty!"] : []
    };
};