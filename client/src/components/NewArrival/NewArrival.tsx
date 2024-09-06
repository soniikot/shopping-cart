import knittedJoggers from '../../assets/knitted-joggers.png';
import fullSleeve from '../../assets/full-sleeve.png';
import active from '../../assets/active.png';
import urban from '../../assets/urban.png';
import style from './styles.module.scss';

const categories = [
  {
    id: 1,
    title: 'Knitted Joggers',
    image: knittedJoggers,
  },
  {
    id: 2,
    title: 'Full Sleeve',
    image: fullSleeve,
  },
  {
    id: 3,
    title: 'Active T-Shirts',
    image: active,
  },
  {
    id: 4,
    title: 'Urban Shirts',
    image: urban,
  },
];

export const NewArrival = () => {
  return (
    <div className="container">
      <div className={style.wrapper}>
        {categories.map((category) => (
          <div key={category.id} className={style.card}>
            <img src={category.image} alt={category.title} />
            <h6>{category.title}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};
