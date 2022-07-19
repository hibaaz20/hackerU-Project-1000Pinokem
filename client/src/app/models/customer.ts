import { Order } from "./orders";
import { Photo } from "./photo";

export interface Customer {
  id:           number;
  userName:     string;
  photoUrl:     string;
  city:         string;
  photo:        Photo;
  email:        string;


}