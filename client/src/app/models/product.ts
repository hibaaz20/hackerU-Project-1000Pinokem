import { Photo } from "./photo";

export interface Product {
    id: number;
    productName: string;
    productDescription: string;
    photoUrl: string;
    price: number;
    productPhotos: Photo[];
    created: Date;
    quantity: number;
    total: number;
}
