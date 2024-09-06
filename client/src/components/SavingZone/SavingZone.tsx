import style from './styles.module.scss';
import hawT from '../../assets/hawaian shirts.jpeg';
import printedT from '../../assets/printed-t.jpeg';
import cargoJ from '../../assets/cargo-joggers.jpeg';
import urbanS from '../../assets/urban-shirts.jpeg';
import OversizedT from '../../assets/oversized-t.jpeg';

const savingZone = [
  {
    id: 1,
    title: 'Hawaiian Shirts',
    subtitle: 'Dress up in summer vibe',
    discount: 'UP TO 50% OFF',
    isLimited: false,
    img: hawT,
    isBlack: false,
  },
  {
    id: 2,
    title: 'Printed T-Shirt',
    subtitle: 'New Designs Every Week',
    discount: 'UP TO 40% OFF',
    isLimited: true,
    img: printedT,
    isBlack: false,
  },
  {
    id: 3,
    title: 'Cargo Joggers',
    subtitle: 'Move with Style and Comfort',
    discount: 'UP TO 50% OFF',
    isLimited: false,
    img: cargoJ,
    isBlack: true,
  },
  {
    id: 4,
    title: 'Urban Shirts',
    subtitle: 'Live in Comfort',
    discount: 'FLAT 60% OFF',
    isLimited: false,
    img: urbanS,
    isBlack: true,
  },
  {
    id: 5,
    title: 'Oversized T-Shirts',
    subtitle: 'Street Style Icon',
    discount: 'FLAT 60% OFF',
    isLimited: false,
    img: OversizedT,
    isBlack: true,
  },
];

export const SavingZone = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        {savingZone.map((item) => (
          <div
            key={item.id}
            className={item.isBlack ? style.item_black : style.item}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {item.isLimited && <span>Limited Time Offer!</span>}
            <h2>{item.title}</h2>
            <p>{item.subtitle}</p>
            <p>{item.discount}</p>
            <button className={style.button}>Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};
