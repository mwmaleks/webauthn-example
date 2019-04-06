type createName = (email: string) => string;

/**
 * creates name from email by splitting over @
 * @param email
 */
const createName: createName = (email = '') => {
    if (!email) {
        return '';
    }

    return email.split('@')[0];
};

export default createName;
