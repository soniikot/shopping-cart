import style from './style.module.scss';
import { FC } from 'react';

export const Table: FC = () => {
  return (
    <div className="container">
      <table className={style.table}>
        <tr>
          <th>Women's Clothing</th>
          <th>Best Price</th>
        </tr>
        <tr>
          <td>Pick Any 4- Women'ss Plain T-shirt Combo</td>
          <td>₹1099</td>
        </tr>
        <tr>
          <td>Pick Any 4- Plain Women'ss Boxer Combo</td>
          <td>₹1099</td>
        </tr>
        <tr>
          <td>Pick Any 4 - Women Plain Full Sleeve T-shirt Combo</td>
          <td>₹1399</td>
        </tr>
        <tr>
          <td>Multicolor Checkered Long Casual Shirts for Women</td>
          <td>₹499</td>
        </tr>
        <tr>
          <td>Pick Any 2: Plain Boxy Casual Shirts for Women Combo</td>
          <td>₹799</td>
        </tr>
        <tr>
          <td>Blue Floral Anarkali Kurti</td>
          <td>₹599</td>
        </tr>
        <tr>
          <td>Jade Black Narrow Cut Flexible Women Jeggings</td>
          <td>₹998</td>
        </tr>
        <tr>
          <td>Mustard-yellow Solid Straight-Fit Women Pant</td>
          <td>₹499</td>
        </tr>
        <tr>
          <td>Women Pants Combo - Pick Any 2</td>
          <td>₹800</td>
        </tr>
        <tr>
          <td>Pista Green Solid Boxy Casual Shirts for Women</td>
          <td>₹449</td>
        </tr>
        <tr>
          <td>Plain Burgundy Womens Boxer</td>
          <td>₹349</td>
        </tr>
        <tr>
          <td>Striped Front Tie Casual Shirts for Women</td>
          <td>₹449</td>
        </tr>
      </table>
    </div>
  );
};
