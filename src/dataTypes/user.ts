import Currency from './currency';

interface BaseUser {
    id: string;
    country: string;
    email: string;
    gender: string;
    name: string;
    timezone: string;
    username: string;
}

export default interface User extends BaseUser {
    currency: Currency;
}

export interface UserRepo extends BaseUser {
    currency: any;
}

export interface UserWithRef extends BaseUser {
    currency: string;
}

