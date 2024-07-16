export type OperationType = {
    operations: Array<Operation1Type>
}
export type Operation1Type = {
    id: string,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string,
    error:  boolean,
    message: string
}