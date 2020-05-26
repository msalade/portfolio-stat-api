import Operation from './operation';
import User from './user';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

interface BaseTransaction {
    id: string;
    comment: string;
    date: Date;
    exchange: string;
    type: string;
}

export default interface Transaction extends BaseTransaction {
    buy: Operation;
    sell: Operation;
    user: User;
}

export interface TransactionRef extends BaseTransaction {
    buy: string;
    sell: string;
    user: string;
}

export interface TransactionRepo extends BaseTransaction {
    buy: any;
    sell: any;
    user: any;
}
