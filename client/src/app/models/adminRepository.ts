import { Photo } from "./photo";

export interface adminRepository {
    id:           number;
    userName:     string;
    photoUrl:     string;
    email:        string;
    photo:       Photo;
}