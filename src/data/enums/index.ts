interface IFirebaseWhereClause{
    fieldPath: string | firebase.firestore.FieldPath;
    operationString: firebase.firestore.WhereFilterOp;
    value: any;
}
export type {
  IFirebaseWhereClause
}
export { UserLocation } from './UserLocation'; //TODO: Rename these with the correct 'I' notation...
export { BookCondition } from './BookCondition';
// export { IFirebaseWhereClause } from './IFirebaseWhereClause'