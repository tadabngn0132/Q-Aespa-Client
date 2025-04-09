import { validateName } from "./authValidator";
import { validateEmail } from "./authValidator";
import { validatePassword } from "./authValidator";

export const validateCreateUser = (data) => {
    return {
        name: validateName(data.name),
        email: validateEmail(data.email),
        password: validatePassword(data.password)
    };
};

export const validateEditUser = (data) => {
    return {
        name: validateName(data.name),
        email: validateEmail(data.email),
        password: []
    };
};