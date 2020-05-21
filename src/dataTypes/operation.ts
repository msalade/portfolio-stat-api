import Currency from './currency';

interface BaseOperation {
    ammount: number;
}

export default interface Operation extends BaseOperation {
    currency: Currency;
}

export interface OperationRepo extends BaseOperation {
    currency: any;
}

export interface OperationWithRef extends BaseOperation {
    currency: string;
}
