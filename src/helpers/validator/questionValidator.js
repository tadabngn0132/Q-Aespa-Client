const validateTitle = (title) => {
    const errors = [];

    if (!title) {
        errors.push("Title can not be empty!");
    } else if (title.trim() === '') {
        errors.push("Title can not contain only whitespace!");
    } else if (title.length < 12) {
        errors.push("Title must be at least 12 characters.")
    } else if (title.length > 200) {
        errors.push('Title can not be exceed 200 characters.')
    }

    return errors;
};

const validateDescription = (description) => {
    const errors = []

    if (!description) {
        errors.push("Description can not be empty!")
    } else if (description.trim() === '') {
        errors.push("Description can not contain only whitespace.");
    } else if (description.length < 20) {
        errors.push("Description must be at least 20 characters.");
    } else if (description.length > 10000) {
        errors.push("Description can not exceed 10000 characters.");
    }

    return errors;
};

export const validateQuestion = (data) => {
    return {
        title: validateTitle(data.title),
        description: validateDescription(data.description),
        tag: data.tags.length === 0 ? ["There must be at least one tag."] : []
    };
};