import { UserLocation } from "data/enums";

export interface IUserCreationInfo {
    preferredName: string;
    phone: string;
    location: UserLocation;
    nameError: boolean;
    locationError: boolean;
    phoneError: boolean;
}