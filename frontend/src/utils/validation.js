export const alphanumericHispanicWithSpaces = (value) => /^[a-z0-9ñáéíóú ]+$/gi.test(value);
export const email = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
export const phone = (value) => /^\+?[0-9]+$/.test(value);