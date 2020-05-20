import Operation from './operation';
import User from './user';

export default interface Transaction {
    comment: string;
    date: Date;
    exchange: string;
    type: string;
    buy: Operation;
    sell: Operation;
    user: User;
}
