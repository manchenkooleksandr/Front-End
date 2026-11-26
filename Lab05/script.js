const patterns = {
  person: /^\p{L}[\p{L}'’\-]* \p{L}\.\s?\p{L}\.$/u,
  variant: /^\d{2}$/,
  group: /^\p{L}{2}-\d{2}$/u,
  phone: /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
  document: /^\p{L}{2} №\d{6}$/u,
};
const form = document.getElementById('registration');
const entries = [...form.querySelectorAll('input')];
const feedback = document.getElementById('feedback');
const result = document.getElementById('result');
const submitted = document.getElementById('submitted');

for (const entry of entries) {
  entry.addEventListener('input', () => {
    if (patterns[entry.name].test(entry.value.trim())) {
      entry.removeAttribute('aria-invalid');
    }
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const invalid = [];
  for (const entry of entries) {
    if (patterns[entry.name].test(entry.value.trim())) {
      entry.removeAttribute('aria-invalid');
    } else {
      entry.setAttribute('aria-invalid', 'true');
      invalid.push(entry);
    }
  }
  if (invalid.length) {
    feedback.textContent = 'Перевірте формат виділених полів.';
    invalid[0].focus();
    return;
  }
  feedback.textContent = '';
  submitted.replaceChildren(...entries.flatMap(entry => {
    const label = document.createElement('dt');
    const value = document.createElement('dd');
    label.textContent = entry.labels[0].textContent;
    value.textContent = entry.value.trim();
    return [label, value];
  }));
  result.showModal();
});

const body = document.getElementById('cells');
const color = document.getElementById('color');
const special = 6;
const dimension = 6;
const cells = Array.from({ length: dimension }, (_, row) => {
  const line = body.insertRow();
  return Array.from({ length: dimension }, (_, col) => {
    const number = row * dimension + col + 1;
    const cell = line.insertCell();
    cell.textContent = String(number);
    if (number === special) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(number);
      button.setAttribute('aria-label', 'Клітинка 6, застосувати обраний колір');
      cell.replaceChildren(button);
    }
    return cell;
  });
});
const startRow = Math.floor((special - 1) / dimension);
const startColumn = (special - 1) % dimension;
const target = cells[startRow][startColumn];

function paint(cell, hex) {
  cell.style.backgroundColor = hex;
  const [red, green, blue] = hex.slice(1).match(/../g).map(value => {
    const channel = Number.parseInt(value, 16) / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  cell.style.color = .2126 * red + .7152 * green + .0722 * blue > .179 ? '#000' : '#fff';
}
function paintRegion() {
  for (const row of cells.slice(startRow)) {
    for (const cell of row.slice(startColumn)) paint(cell, color.value);
  }
}
target.addEventListener('pointerenter', () => {
  const random = Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
  paint(target, `#${random}`);
});
target.addEventListener('click', () => paint(target, color.value));
target.addEventListener('dblclick', paintRegion);
document.getElementById('paint-area').addEventListener('click', paintRegion);
