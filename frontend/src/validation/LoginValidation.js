function LoginValidation(values) {
    let error = {};
    const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    if (values.email === "") {
        error.email = "Email must not be empty";
    }
    else if (!email_pattern.test(values.email)) {
        error.email = "Email did not match!"
    }
    else {
        error.email = "";
    }

    if (values.password === "") {
        error.password = "Password must not be empty";
    }
    else if (!password_pattern.test(values.password)) {
        error.password = "Password did not match"
    }
    else {
        error.password = "";
    }

    return error;
}

export default LoginValidation;