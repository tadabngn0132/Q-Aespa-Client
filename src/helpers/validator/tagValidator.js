const validateName = (name) => {
    const errors = [];

    if (!name) {
        errors.push('Name can not be empty!');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters.');
    } else if (name.length > 35) {
        errors.push('Name can not exceed 35 characters.');
    } else if (name.trim() === '') {
        errors.push('Name can not contain only whitespace.');
    }

    return errors;
};

const validateDescription = (description) => {
    const errors = [];

    if (!description) {
        errors.push('Description can not be empty!');
    } else if (description.trim() === '') {
        errors.push('Description can not contain only whitespace.');
    } else if (description.length < 20) {
        errors.push('Description must be at least 20 characters.');
    } else if (description.length > 10000) {
        errors.push('Description can not exceed 10000 characters.');
    }

    return errors;
};

export const validateTag = (data) => {
    return {
        name: validateName(data.name),
        description: validateDescription(data.description)
    };
};