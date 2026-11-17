import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const ordinal = (76 % 10) + 1;
const asset = file => `${import.meta.env.BASE_URL}photos/${file}.jpg`;
const items = [
  { file: 'camera', name: 'Фотокамера', amount: 17900 },
  { file: 'headphones', name: 'Бездротові навушники', amount: 2450 },
  { file: 'keyboard', name: 'Механічна клавіатура', amount: 3180 },
  { file: 'microphone', name: 'Студійні монітори', amount: 8200 },
  { file: 'design', name: 'Блокнот для ескізів', amount: 310 },
  { file: 'backpack', name: 'Міський рюкзак', amount: 1970 },
];
const currency = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 });

function Header({ author }) {
  return <header><h1>Сторінка студента</h1><h2>{author}</h2></header>;
}

function Image({ visible, width, onAdd, onGrow, onShrink, onRemove }) {
  return (
    <section aria-label="Фотографія Києва">
      {visible && (
        <figure>
          <a href="https://kyivcity.gov.ua/">
            <img className="city" src={asset('kyiv')} width="960" height="638"
              style={{ width }} alt="Майдан Незалежності. Перейти на сайт Києва" />
          </a>
          <figcaption>
            <a href="https://commons.wikimedia.org/wiki/File:17-07-02-Maidan_Nezalezhnosti_RR74361.jpg">
              Фото Ральфа Ролетшека
            </a>
          </figcaption>
        </figure>
      )}
      <div className="toolbar">
        <button type="button" disabled={visible} onClick={onAdd}>Додати</button>
        <button type="button" disabled={!visible} onClick={onGrow}>Збільшити</button>
        <button type="button" disabled={!visible} onClick={onShrink}>Зменшити</button>
        <button type="button" disabled={!visible} onClick={onRemove}>Видалити</button>
      </div>
      <p role="status">{visible ? `Ширина фото: ${width} px.` : 'Фото видалено.'}</p>
    </section>
  );
}

class Content extends Component {
  state = { highlighted: [], visible: true, width: 520 };

  toggle = id => {
    this.setState(({ highlighted }) => ({
      highlighted: highlighted.includes(id) ? highlighted.filter(value => value !== id) : [...highlighted, id],
    }));
  };

  resize = step => {
    this.setState(({ width }) => ({ width: Math.max(200, Math.min(960, width + step)) }));
  };

  hobby = (name, position) => {
    const enabled = position === ordinal || position === ordinal + 1;
    const active = this.state.highlighted.includes(position);
    return (
      <li key={name} id={`item-${position}`} className={active ? `tone tone-${position}` : ''}>
        {enabled
          ? <button className="inline-control" type="button" aria-pressed={active}
              onClick={() => this.toggle(position)}>{name}</button>
          : name}
      </li>
    );
  };

  render() {
    return (
      <div>
        <p>Демонстраційні відомості про народження: 15 травня 2006 року, Київ.</p>
        <p>Демонстраційні відомості про освіту: київський ліцей, КПІ ім. Ігоря Сікорського.
          Адреса університету: Берестейський проспект, 37, Київ.</p>
        <h2>Захоплення</h2>
        <ul>{['Велопрогулянки', 'Міська фотографія', 'Настільні ігри'].map((name, index) => this.hobby(name, index + 6))}</ul>
        <h2>Улюблені фільми</h2>
        <ol><li>Інтерстеллар</li><li>Прибуття</li><li>Марсіянин</li></ol>
        <p>Від майдану можна піднятися до Володимирської гірки, щоб побачити Дніпро й лівий берег.</p>
        <Image visible={this.state.visible} width={this.state.width}
          onAdd={() => this.setState({ visible: true, width: 520 })}
          onGrow={() => this.resize(80)} onShrink={() => this.resize(-80)}
          onRemove={() => this.setState({ visible: false })} />
      </div>
    );
  }
}

function GoodsCard({ photo, title, price }) {
  return (
    <article className="product">
      <img src={photo} alt={title} width="320" height="216" loading="lazy" />
      <h3>{title}</h3>
      <p>{currency.format(price)}</p>
    </article>
  );
}

function App() {
  return (
    <main>
      <Header author="Манченко Олександр Віталійович" />
      <Content />
      <section aria-labelledby="goods-title">
        <h2 id="goods-title">Галерея товарів</h2>
        <div className="products">
          {items.map(({ file, name, amount }) => (
            <GoodsCard key={file} photo={asset(file)} title={name} price={amount} />
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
