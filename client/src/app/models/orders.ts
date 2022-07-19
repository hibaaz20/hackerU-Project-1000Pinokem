import { Customer } from "./customer";
import { Product } from "./product";

export interface Order {
  orderId:      number;
  orderDate:    Date;
  product:      Product;
  customer:     Customer;
  total:        number;
  quantity:        number;

}