export default interface GetDataTypes {
  userData: {
    email: string;
    name: string;
    picture : string;
    notes : Array<string> ;
  };
  message :string ;
}