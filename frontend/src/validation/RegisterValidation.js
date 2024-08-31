function RegisterValidation(values) {
    let error = {};
    const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    const name_pattern = /([a-zA-Z_\s]+)/
    if (values.name === "") {
        error.name = "Name must not be empty";
    }
    else if (!name_pattern.test(values.name)) {
        error.name = "Name did not match!"
    }
    else {
        error.name = "";
    }

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

    if (values.re_password !== values.password) {
        error.re_password = "Re-password dit not match";
    }
    else {
        error.re_password = "";
    }

    return error;
}

export default RegisterValidation;