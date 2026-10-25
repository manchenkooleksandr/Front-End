const variant = 76;
const ordinal = (variant % 10) + 1;
const first = document.getElementById(`item-${ordinal}`);
const second = document.querySelector(`[data-ordinal="${ordinal + 1}"]`);

for (const [element, tone] of [[first, 'tone-a'], [second, 'tone-b']]) {
  element.tabIndex = 0;
  const toggle = () => element.classList.toggle(tone);
  element.addEventListener('click', toggle);
  element.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
}

const picture = document.getElementById('picture');
const original = picture.firstElementChild.cloneNode();
const status = document.getElementById('image-status');
const controls = document.querySelector('.controls');
let width = 520;

function update() {
  picture.style.setProperty('--image-width', `${width}px`);
  for (const button of controls.querySelectorAll('button')) {
    button.disabled = button.dataset.action === 'add'
      ? picture.children.length > 0
      : picture.children.length === 0;
  }
  picture.hidden = picture.children.length === 0;
  status.textContent = picture.hidden ? 'Фото видалено.' : `Ширина фото: ${width} px.`;
}

controls.addEventListener('click', event => {
  const action = event.target.dataset.action;
  if (action === 'add') {
    picture.replaceChildren(original.cloneNode());
    width = 520;
  } else if (action === 'increase') {
    width = Math.min(960, width + 80);
  } else if (action === 'decrease') {
    width = Math.max(200, width - 80);
  } else if (action === 'remove') {
    picture.replaceChildren();
  } else {
    return;
  }
  update();
});
update();
