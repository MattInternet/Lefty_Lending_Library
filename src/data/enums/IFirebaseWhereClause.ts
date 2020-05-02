
interface IFirebaseWhereClause{
    fieldPath: string | firebase.firestore.FieldPath;
    operationString: firebase.firestore.WhereFilterOp;
    value: any;
}
export type {
  IFirebaseWhereClause
}