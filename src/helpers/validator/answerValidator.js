const validateDescription = (description) => {
    const errors = [];

    if (!description) {
        errors.push('Description can not be blank!');
    } else if (description.trim() === '') {
        errors.push('Description can not contain only whitespace.');
    } else if (description.length < 20) {
        errors.push('Description must be at least 20 characters.');
    }

    return errors;
};

export const validateAnswer = (description) => {
    return {
        descriptionErrors: validateDescription(description)
    };
};