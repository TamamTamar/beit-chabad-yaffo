export const urlPattern = {
    value: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
    message: "Invalid URL",
};

export const emailPattern = {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
    message: "נא להזין כתובת אימייל תקינה",
};

export const passwordPattern = {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-]).{9,20}$/,
    message: "Password must be 9–20 chars, include upper, lower, number & special char",
};

export const phonePattern = {
    value: /^0\d{1,2}-?\d{7}$/,
    message: "Invalid Israeli phone number",
};

const patterns = {
    url: urlPattern,
    email: emailPattern,
    phone: phonePattern,
    password: passwordPattern,
};

export default patterns;
