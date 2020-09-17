export interface IAlert {
  ID: number;
  Title: string;
  AlertMessage: string;
  AlertStart: Date;
  AlertEnd: Date;
  AlertType: string;
  MoreInformation: {
    Description: string;
    Url: string;
  };
  Hide: boolean;
}
